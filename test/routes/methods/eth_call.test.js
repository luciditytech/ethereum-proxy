import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from 'src/app';

import { genContractTx, sendTx } from 'test/helpers/send_tx';

chai.use(chaiHttp);

describe('methods/eth_call', function() {
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

    const blockNumber = parseInt(json1.result);

    const { from, to, bytes, func } = await genContractTx();

    await sendTx(bytes);

    // call and check function result
    const a2 = 1, b2 = 4;
    const res2 = await requester
      .post('/')
      .send({
        method: 'eth_call',
        id: 2,
        params: [
          {
            from,
            to,
            "data": `${func}000000000000000000000000000000000000000000000000000000000000000${a2}000000000000000000000000000000000000000000000000000000000000000${b2}`
          }, "latest"]
      });

    const json2 = JSON.parse(res2.text);
    expect(json2.id).to.eq(2);
    expect(json2.jsonrpc).to.eq("2.0");
    expect(json2).to.have.property('result');
    expect(json2.result).to.eq(`0x000000000000000000000000000000000000000000000000000000000000000${a2 + b2}`);
    expect(json2).to.not.have.header('X-CACHE-COUNTER');

    // call with other params
    const a3 = 5, b3 = 3;
    const res3 = await requester
      .post('/')
      .send({
        method: 'eth_call',
        id: 3,
        params: [
          {
            from,
            to,
            "data": `${func}000000000000000000000000000000000000000000000000000000000000000${a3}000000000000000000000000000000000000000000000000000000000000000${b3}`
          }, "latest"]
      });

    const json3 = JSON.parse(res3.text);
    expect(json3.id).to.eq(3);
    expect(json3.jsonrpc).to.eq("2.0");
    expect(json3).to.have.property('result');
    expect(json3.result).to.eq(`0x000000000000000000000000000000000000000000000000000000000000000${a3 + b3}`);
    expect(res3).to.not.have.header('X-CACHE-COUNTER');

    // call should be cached
    const res4 = await requester
      .post('/')
      .send({
        method: 'eth_call',
        id: 3,
        params: [
          {
            from,
            to,
            "data": `${func}000000000000000000000000000000000000000000000000000000000000000${a3}000000000000000000000000000000000000000000000000000000000000000${b3}`
          }, "latest"]
      });

    const json4 = JSON.parse(res4.text);
    expect(json4.id).to.eq(3);
    expect(json4.jsonrpc).to.eq("2.0");
    expect(json4).to.have.property('result');
    expect(json4.result).to.eq(`0x000000000000000000000000000000000000000000000000000000000000000${a3 + b3}`);
    expect(res4).to.have.header('X-CACHE-COUNTER');

    await sendTx();

    // call should not be cached anymore
    const res5 = await requester
      .post('/')
      .send({
        method: 'eth_call',
        id: 3,
        params: [
          {
            from,
            to,
            "data": `${func}000000000000000000000000000000000000000000000000000000000000000${a3}000000000000000000000000000000000000000000000000000000000000000${b3}`
          }, "latest"]
      });

    const json5 = JSON.parse(res5.text);
    expect(json5.id).to.eq(3);
    expect(json5.jsonrpc).to.eq("2.0");
    expect(json5).to.have.property('result');
    expect(json5.result).to.eq(`0x000000000000000000000000000000000000000000000000000000000000000${a3 + b3}`);
    expect(res5).to.not.have.header('X-CACHE-COUNTER');
  });
});
