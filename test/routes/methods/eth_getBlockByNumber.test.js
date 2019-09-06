import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from 'src/app';

import { sendTx } from 'test/helpers/send_tx';

chai.use(chaiHttp);

describe('methods/eth_getBlockByNumber', function() {
  let requester;

  beforeEach(async () => {
    requester = chai.request(app).keepOpen();
  });

  afterEach(async () => {
    requester.close();
  });

  it('should return block by number', async () => {
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

    const blockNumber = parseInt(json1.result);

    // request block
    const res2 = await requester
      .post('/')
      .send({
        method: 'eth_getBlockByNumber',
        id: 2,
        params: [`0x${blockNumber.toString(16)}`, false]
      });

    const json2 = JSON.parse(res2.text);
    expect(json2.id).to.eq(2);
    expect(json2.jsonrpc).to.eq("2.0");
    expect(json2).to.have.property('result');
    expect(res2).to.not.have.header('X-CACHE-COUNTER');

    // block should be cached
    const res3 = await requester
    .post('/')
    .send({
      method: 'eth_getBlockByNumber',
      id: 3,
      params: [`0x${blockNumber.toString(16)}`, false]
    });

    const json3 = JSON.parse(res3.text);
    expect(json3.id).to.eq(3);
    expect(json3.jsonrpc).to.eq("2.0");
    expect(json3).to.have.property('result');
    expect(res3).to.have.header('X-CACHE-COUNTER');

    // request with txs
    const res4 = await requester
    .post('/')
    .send({
      method: 'eth_getBlockByNumber',
      id: 4,
      params: [`0x${blockNumber.toString(16)}`, true]
    });

    const json4 = JSON.parse(res4.text);
    expect(json4.id).to.eq(4);
    expect(json4.jsonrpc).to.eq("2.0");
    expect(json4).to.have.property('result');

    await sendTx();

    // should not be cached after a new block
    const res5 = await requester
    .post('/')
    .send({
      method: 'eth_getBlockByNumber',
      id: 5,
      params: [`0x${blockNumber.toString(16)}`, false]
    });

    const json5 = JSON.parse(res5.text);
    expect(json5.id).to.eq(5);
    expect(json5.jsonrpc).to.eq("2.0");
    expect(json5).to.have.property('result');
  });
});
