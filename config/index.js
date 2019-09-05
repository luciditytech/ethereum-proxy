import abi from './abi';

const config = {
  port: parseInt(process.env.PORT || "3000"),
  networkName: process.env.NETWORK_NAME || 'ropsten',
  infuraID: process.env.INFURA_ID || "",
  lastBlockTimeout: parseInt(process.env.LAST_BLOCK_TIMEOUT || "40000"),
  abi
};

export default Object.freeze(config);
