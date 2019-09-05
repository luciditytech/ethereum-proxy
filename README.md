## .env

```bash
INFURA_ID=...
NETWORK_NAME=ropsten
```

## Run server
```bash
npm start
```

## Call the proxy
```bash
curl localhost:3000 -X POST --data '{method":"eth_blockNumber"}' -H "Content-Type: application/json"

curl localhost:3000 -X POST --data '{"method":"eth_call","params":[{"from": "0x8aff0a12f3e8d55cc718d36f84e002c335df2f4a", "to": "0x5c7687810ce3eae6cda44d0e6c896245cd4f97c6", "data": "0x6740d36c0000000000000000000000000000000000000000000000000000000000000005"}, "latest"]}' -H "Content-Type: application/json"
```
