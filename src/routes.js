import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import web3Methods from './web3Methods';
import gasPrice from './handlers/gasPrice';
import netVersion from './handlers/netVersion';
import blockNumber from './handlers/blockNumber';
import ethCall from './handlers/ethCall';
import infuraCall from './handlers/infuraCall';

import config from '../config/index';

import { listenLastBlockNumber } from './lastBlockHeader';

const router = new Router();

function infuraPost(req, res) {
  if (req.body.method === 'eth_blockNumber') {
    blockNumber(req, res);
  } else if (req.body.method === 'eth_gasPrice') {
    gasPrice(req, res);
  } else if (req.body.method === 'net_version') {
    netVersion(req, res);
  } else if (req.body.method === 'eth_call'
      || req.body.method.startsWith('eth_get')) {
    ethCall(req, res);
  } else {
    infuraCall(req, res);
  }
}

const web3RequestStructure = {
  body: Joi.object({
    jsonrpc: Joi.string().empty('').default('2.0'),
    id: Joi.number().default(1),
    method: Joi.string().valid(...web3Methods).required(),
    params: Joi.array().default([])
  })
};

router.route('/').post(
  celebrate(web3RequestStructure),
  infuraPost
);

let lastBlockDate = Date.now();
listenLastBlockNumber(() => {
  lastBlockDate = Date.now();
});

router.get('/health', (req, res) => {
  const secondsPassed = Date.now() - lastBlockDate;
  if (secondsPassed > config.blockHealthTimeout) {
    res.status(500).send(`The latest block was received ${Math.floor(secondsPassed / 1000)} seconds ago`);
  } else {
    res.send('OK');
  }
});

export default router;
