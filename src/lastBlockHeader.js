import Web3 from 'web3';

import config from '../config/index';

import { ws as url } from '../config/urls';

import { call } from './handlers/infuraCall';

const listeners = [];
export function listenLastBlockNumber(listener) {
  listeners.push(listener);
}

let lastBlockHeader = null;
function updateBlockHeader(blockHeader) {
  if (lastBlockHeader
    && blockHeader.number === lastBlockHeader.number) {
    return;
  }

  lastBlockHeader = blockHeader;

  console.info(`Infura next block: ${blockHeader.number}`);

  listeners.forEach(listener => listener(lastBlockNumber()));
}

export function lastBlockNumber() {
  return lastBlockHeader ? lastBlockHeader.number : null;
}

let timeout = null;

function stopPeriodicSubscription() {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
}
function resetPeriodicSubscription() {
  stopPeriodicSubscription();
  timeout = setTimeout(subscribe, config.blockSubscriptionTimeout);
}

let subscriptionContext = null;

let blockPollTimeout = null;

function stopBlockPoll() {
  if (blockPollTimeout) {
    clearTimeout(blockPollTimeout);
    blockPollTimeout = null;
  }
}

function scheduleBlockPoll(timeout) {
  blockPollTimeout = setTimeout(() => {
    call({
      body: { jsonrpc: "2.0", id: 0, params: [], method: "eth_blockNumber" }
    }, undefined, (res, data) => {
      updateBlockHeader({
        number: parseInt(data.result)
      });
      scheduleBlockPoll(timeout);
    }, (res, err) => {
      console.error(err);
      scheduleBlockPoll(timeout);
    });
  }, timeout);
}

export function subscribe() {
  unsubscribe();

  if (config.blockPollTimeout > 0) {
    scheduleBlockPoll(config.blockPollTimeout)
    return
  }

  console.info('Subscribing for Infura newBlockHeaders...');

  const websocketProvider = new Web3.providers.WebsocketProvider(url);
  const web3 = new Web3(websocketProvider);

  const subscription = web3.eth.subscribe('newBlockHeaders');
  subscription.on('data', async (data, error) => {
    if (error) {
      console.error(data, error);
      return;
    }

    updateBlockHeader(data);

    resetPeriodicSubscription();
  })
  .on('error', console.error);

  resetPeriodicSubscription();

  subscriptionContext = {
    web3,
    websocketProvider,
    subscription
  };
}

export function unsubscribe() {
  if (config.blockPollTimeout > 0) {
    stopBlockPoll();
  } else if (subscriptionContext) {
    console.info('Unsubscribing from Infura newBlockHeaders...');

    subscriptionContext.subscription.unsubscribe()
      .catch(console.error);

    subscriptionContext.websocketProvider.disconnect();
    subscriptionContext = null;
  }

  stopPeriodicSubscription();
}
