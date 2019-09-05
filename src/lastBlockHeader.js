import Web3 from 'web3';

import config from '../config/index';

const web3 = () => (new Web3(new Web3.providers.WebsocketProvider(`wss://${config.networkName}.infura.io/ws/v3/${config.infuraID}`)));

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
function resetTimeout() {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(subscribe, config.lastBlockTimeout);
}

let subscription = null;

function subscribe() {
  console.info('Subscribing for Infura newBlockHeaders...');

  if (subscription) {
    subscription.unsubscribe();
  }
  subscription = web3().eth.subscribe('newBlockHeaders');
  subscription.on('data', async (data, error) => {
      if (error) {
        console.error(data, error);
        return;
      }

      updateBlockHeader(data);

      resetTimeout();
    })
    .on('error', console.error);

  resetTimeout();
}

subscribe();
