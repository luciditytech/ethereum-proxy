import config from './index';

export const ws = process.env.NODE_ENV === 'test' ?
  'ws://localhost:8545/ws' :
  `wss://${config.networkName}.infura.io/ws/v3/${config.infuraID}`;

export default process.env.NODE_ENV === 'test' ?
  'http://localhost:8545' :
  `https://${config.networkName}.infura.io/v3/${config.infuraID}`;

