import { describe } from 'mocha';
import { expect } from 'chai';

import abi from 'config/abi';

describe('abi', function() {
  it('abi should be present', function() {
    expect(abi).to.not.be.empty;
  });
});
