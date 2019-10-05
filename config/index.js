import abi from './abi';

const config = {
  port: parseInt(process.env.PORT || "3000"),
  networkName: process.env.NETWORK_NAME || 'ropsten',
  infuraID: process.env.INFURA_ID || "",
  abi: process.env.ABI || abi,
  blockSubscriptionTimeout: parseInt(process.env.BLOCK_SUBSCRIPTION_TIMEOUT || "60") * 1000,
  blockPollTimeout: parseInt(process.env.BLOCK_POLL_TIMEOUT || "0") * 1000,
  blockHealthTimeout: parseInt(process.env.BLOCK_HEALTH_TIMEOUT || "150") * 1000,
};

export default Object.freeze(config);
