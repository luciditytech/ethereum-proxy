import Web3 from 'web3';
import url from '../../config/urls';

const rlp = require('rlp');
const keccak = require('keccak');

const EthereumTx = require('ethereumjs-tx').Transaction;

const web3 = new Web3(new Web3.providers.HttpProvider(url));

const privateKey = "0x8d0b980d81d948c62788aab70c59749badace38c0ecc69334f4d9ab62bc187ef";

export async function genTx() {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const balanceWei = await web3.eth.getBalance(web3.eth.defaultAccount);
  const balance = parseInt(web3.utils.fromWei(balanceWei, 'ether'));

  if (balance < 1) {
    throw "Not enough ethers to send tx";
  }


  const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount);

  const gasPrice = 1;
  const amountToSend = "0.001";

  let details = {
    to: "0x0000000000000000000000000000000000000000",
    value: web3.utils.toHex( web3.utils.toWei(amountToSend, 'ether') ),
    gas: 21000,
    gasPrice: gasPrice * 1000000000,
    nonce: nonce
  };

  const transaction = new EthereumTx(details);
  transaction.sign(Buffer.from(account.privateKey.substring(2), 'hex'));

  const serializedTransaction = transaction.serialize();

  return '0x' + serializedTransaction.toString('hex');
}

const abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_value1",
        "type": "uint256"
      },
      {
        "name": "_value2",
        "type": "uint256"
      }
    ],
    "name": "add",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const bytecode = "0x608060405234801561001057600080fd5b5060d28061001f6000396000f3fe608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063771602f7146044575b600080fd5b348015604f57600080fd5b50608360048036036040811015606457600080fd5b8101908080359060200190929190803590602001909291905050506099565b6040518082815260200191505060405180910390f35b600081830190509291505056fea165627a7a72305820a2893d954d5280c8f6cfa95ecb996d21f46855c1ff7b98c4e2b9737b0088a9730029";

export async function genContractTx() {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const balanceWei = await web3.eth.getBalance(web3.eth.defaultAccount);
  const balance = parseInt(web3.utils.fromWei(balanceWei, 'ether'));

  if (balance < 1) {
    throw "Not enough ethers to send tx";
  }

  const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount);

  const contract = new web3.eth.Contract(abi);
  const toDeploy = await contract.deploy({
    data: bytecode,
    arguments: []
  });

  const gasPrice = 1;

  const details = {
    nonce: nonce,
    from: account.address,
    gas: 1000000,
    gasPrice: gasPrice * 1000000000,
    data: toDeploy.encodeABI()
  };

  const transaction = new EthereumTx(details);
  transaction.sign(Buffer.from(account.privateKey.substring(2), 'hex'));

  const serializedTransaction = transaction.serialize();

  return {
    func: '0x771602f7',
    form: account.address,
    to: contractAddress(nonce),
    bytes: '0x' +serializedTransaction.toString('hex')
  };
}

export async function sendTx(tx) {
  const transactionResult = await web3.eth.sendSignedTransaction(tx || (await genTx()));

  return transactionResult.transactionHash;
}

function contractAddress (nonce) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const sender = account.address;

  const inputArr = [ sender, nonce ];
  const rlpEncoded = rlp.encode(inputArr);

  const contractAddressLong = keccak('keccak256').update(rlpEncoded).digest('hex');

  return contractAddressLong.substring(24);
}
