import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from 'src/app';
import { sendTx } from 'test/helpers/send_tx';

chai.use(chaiHttp);

describe('methods/net_version', function() {
  let requester;

  beforeEach(async () => {
    requester = chai.request(app).keepOpen();
  });

  afterEach(async () => {
    requester.close();
  });

  it('should return testnet net version', async function() {
    const res1 = await requester
      .post('/')
      .send({
        method: 'net_version',
        id: 1
      });

    const json1 = JSON.parse(res1.text);
    expect(json1.id).to.eq(1);
    expect(json1.jsonrpc).to.eq("2.0");
    expect(json1.result).to.eq("3");
    expect(res1).to.not.have.header('X-CACHE-COUNTER');

    // should be cached
    const res2 = await requester
      .post('/')
      .send({
        method: 'net_version',
        id: 2
      });

    const json2 = JSON.parse(res2.text);
    expect(json2.id).to.eq(2);
    expect(json2.jsonrpc).to.eq("2.0");
    expect(json2.result).to.eq("3");
    expect(res2).to.have.header('X-CACHE-COUNTER');

    await sendTx();

    // should be still cached
    const res3 = await requester
      .post('/')
      .send({
        method: 'net_version',
        id: 3
      });

    const json3 = JSON.parse(res3.text);
    expect(json3.id).to.eq(3);
    expect(json3.jsonrpc).to.eq("2.0");
    expect(json3.result).to.eq("3");
    expect(res3).to.have.header('X-CACHE-COUNTER');
  });
});
