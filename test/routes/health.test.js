import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from 'src/app';

import { genTx, sleep } from 'test/helpers/send_tx';

chai.use(chaiHttp);

describe('health', function() {
  let requester;

  beforeEach(async () => {
    requester = chai.request(app).keepOpen();
  });

  afterEach(async () => {
    requester.close();
  });

  it('should return OK', async () => {
    await genTx();

    const res = await requester.get('/health');

    expect(res.text).to.eq('OK');
    expect(res).to.have.status(200);
  });

  it('should return 500', async () => {
    await sleep(5000);

    const res = await requester.get('/health');

    expect(res).to.have.status(500);
  });
});


