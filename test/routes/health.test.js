import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from 'src/app';

chai.use(chaiHttp);

it('/health', function(done) {
  chai.request(app)
  .get('/health')
  .end(function(err, res) {
    expect(res).to.have.status(200);
    expect(res.text).to.eq('OK');
    done();
  });
});


