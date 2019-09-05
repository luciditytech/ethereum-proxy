import { listenLastBlockNumber } from './../lastBlockHeader';
import cachedCall from './cachedCall';

let cache = {};

listenLastBlockNumber(() => {
  const inputs = Object.keys(cache);
  inputs.forEach(input => {
    const { reset } = cache[input];
    delete cache[input];
    reset();
  });
});

function flattenParams(params) {
  if (Array.isArray(params)) {
    return params.map(elem => flattenParams(elem)).join('');
  } else if (typeof params === "object") {
    return flattenParams(Object.values(params));
  }
  return `${params}`;
}

export default function(req, res) {
  const method = req.body.method;

  const input = `${method}${flattenParams(req.body.params)}`;

  let callCache = cache[input];
  if (!callCache) {
    cache[input] = callCache = cachedCall();
  }

  const { call } = callCache;
  call(req, res);
}
