import axios from 'axios';
import web3 from 'web3';

import config from '../../config/index';

const url = `https://${config.networkName}.infura.io/v3/${config.infuraID}`;

const funcNames = config.abi
  .filter(({ type }) => type === 'function')
  .reduce((map, { name, inputs }) => {
    const hash = web3.utils.sha3(`${name}(${inputs.map(({ type }) => type).join(',')})`).slice(0, 10);
    map[hash] = name;
    return map;
  }, {});

const callCount = {};

export function call(req, res, success, reject) {
  if (req.body.method === 'eth_call') {
    const [ params = {} ]= req.body.params;
    const { data = "", to } = params;
    const methodHash = data.slice(0, 10);
    const callKey = `${to}-${methodHash}`;
    const count = (callCount[callKey] || 0) + 1;
    callCount[callKey] = count;
    console.info(`Infura method: ${req.body.method}: ${to}::${funcNames[methodHash] || methodHash}(${count})`);
  } else {
    console.info(`Infura method: ${req.body.method}`);
  }

  axios.post(url, {
    ...req.body
  }).then(({ data }) => {
    success(res, data);
  }).catch(err => {
    console.error(err);

    reject(res, err);
  });
}

export function success(res, data) {
  res.json({
    ...data
  });
}

export function reject(res, err) {
  res.status(400);
  res.send({
    ...err.response.data
  });
}


export default function(req, res) {
  call(req, res, success, reject);
}
