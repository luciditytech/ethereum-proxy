import { success } from './infuraCall';
import { lastBlockNumber } from './../lastBlockHeader';
import cachedCall from './cachedCall';

const { call }  = cachedCall();

export default function(req, res) {
  const blockNumber = lastBlockNumber();
  if (blockNumber) {
    success(res, {
      'jsonrpc': req.body.jsonrpc,
      'id': req.body.id,
      'result': `0x${blockNumber.toString(16)}`
    });
  } else {
    call(req, res);
  }
}
