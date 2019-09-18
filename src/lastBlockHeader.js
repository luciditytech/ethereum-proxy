import Web3 from 'web3';

import config from '../config/index';

import { ws as url } from '../config/urls';

const listeners = [];
export function listenLastBlockNumber(listener) {
  listeners.push(listener);
}

let lastBlockHeader = null;
function updateBlockHeader(blockHeader) {
  lastBlockHeader = blockHeader;

  console.info(`Infura websocket block: ${blockHeader.number}`);

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
  timeout = setTimeout(subscribe, config.lastBlockTimeout);
}

let subscriptionContext = null;

export function subscribe() {
  unsubscribe();

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
  if (subscriptionContext) {
    console.info('Unsubscribing from Infura newBlockHeaders...');

    subscriptionContext.subscription.unsubscribe()
      .catch(console.error);

    subscriptionContext.websocketProvider.disconnect();
    subscriptionContext = null;
  }

  stopPeriodicSubscription();
}
