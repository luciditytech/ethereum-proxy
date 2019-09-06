import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from 'src/app';

import { genTx } from 'test/helpers/send_tx';

chai.use(chaiHttp);

describe('methods/eth_sendRawTransaction', function() {
  let requester;

  beforeEach(async () => {
    requester = chai.request(app).keepOpen();
  });

  afterEach(async () => {
    requester.close();
  });

  it('should send transaction', async () => {
    // get current block
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

    // send tx
    const res2 = await requester
      .post('/')
      .send({
        method: 'eth_sendRawTransaction',
        id: 2,
        params: [await genTx()]
      });

    const json2 = JSON.parse(res2.text);
    expect(json2.id).to.eq(2);
    expect(json2.jsonrpc).to.eq("2.0");
    expect(json2).to.have.property('result');
    expect(res2).to.not.have.header('X-CACHE-COUNTER');

    const res3 = await requester
      .post('/')
      .send({
        method: 'eth_blockNumber',
        id: 3
      });

    // check if block number increased
    const json3 = JSON.parse(res3.text);
    expect(json3.id).to.eq(3);
    expect(json3.jsonrpc).to.eq("2.0");
    expect(json3).to.have.property('result');

    expect(blockNumber).to.eq(parseInt(json3.result) - 1);

    // send another tx, should be be cached
    const tx = await genTx();
    const res4 = await requester
      .post('/')
      .send({
        method: 'eth_sendRawTransaction',
        id: 4,
        params: [tx]
      });

    const json4 = JSON.parse(res4.text);
    expect(json4.id).to.eq(4);
    expect(json4.jsonrpc).to.eq("2.0");
    expect(json4).to.have.property('result');
    expect(res4).to.not.have.header('X-CACHE-COUNTER');

    const res5 = await requester
      .post('/')
      .send({
        method: 'eth_sendRawTransaction',
        id: 4,
        params: [tx]
      });

    const json5 = JSON.parse(res5.text);
    expect(json5.id).to.eq(4);
    expect(json5.jsonrpc).to.eq("2.0");
    expect(json5).to.have.property('error');
  });
});
