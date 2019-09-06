import { describe } from 'mocha';
import { expect } from 'chai';

import web3Methods from 'src/web3Methods';

describe('web3Methods', function() {
  it('web3Methods should include certain methods', function() {
    expect(web3Methods).to.include('eth_blockNumber');
    expect(web3Methods).to.include('eth_estimateGas');
    expect(web3Methods).to.include('eth_gasPrice');
    expect(web3Methods).to.include('eth_getBalance');
    expect(web3Methods).to.include('eth_getBlockByHash');
    expect(web3Methods).to.include('eth_getBlockByNumber');
    expect(web3Methods).to.include('eth_call');
    expect(web3Methods).to.include('eth_sendRawTransaction');
    expect(web3Methods).to.include('eth_accounts');
    expect(web3Methods).to.include('eth_getTransactionByHash');
  });
});
