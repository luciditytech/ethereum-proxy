import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from 'src/app';

import { sendTx } from 'test/helpers/send_tx';

chai.use(chaiHttp);

describe('methods/eth_blockNumber', function() {
  let requester;

  beforeEach(async () => {
    requester = chai.request(app).keepOpen();
  });

  afterEach(async () => {
    requester.close();
  });

  it('should return block number', async () => {
    const res1 = await requester
      .post('/')
      .send({
        method: 'eth_blockNumber',
        id: 1
      });

    const json1 = JSON.parse(res1.text);
    expect(json1.id).to.eq(1);
    expect(json1.jsonrpc).to.eq("2.0");
    expect(json1).to.have.property('result');
    expect(res1).to.not.have.header('X-CACHE-COUNTER');

    const blockNumber = parseInt(json1.result);

    // should be cached
    const res2 = await requester
      .post('/')
      .send({
        method: 'eth_blockNumber',
        id: 2
      });

    const json2 = JSON.parse(res2.text);
    expect(json2.id).to.eq(2);
    expect(json2.jsonrpc).to.eq("2.0");
    expect(json2).to.have.property('result');
    expect(res2).to.have.header('X-CACHE-COUNTER');

    expect(blockNumber).to.eq(parseInt(json2.result));

    await sendTx();

    // should not be cached after a new block
    const res3 = await requester
      .post('/')
      .send({
        method: 'eth_blockNumber',
        id: 3
      });

    const json3 = JSON.parse(res3.text);
    expect(json3.id).to.eq(3);
    expect(json3.jsonrpc).to.eq("2.0");
    expect(json3).to.have.property('result');
    expect(res3).to.have.header('X-CACHE-COUNTER');

    expect(blockNumber).to.eq(parseInt(json3.result) - 1);
  });
});
