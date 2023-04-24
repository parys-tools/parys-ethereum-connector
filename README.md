# parys-ethereum-connector

A minimal connector to make Ethers.JS compatible with the PARYS network.

_Note: this is still experimental_ 

## Install

`npm i @parys-tools/parys-ethereum-connector`

or

`yarn add @parys-tools/parys-ethereum-connector`

Note this wrapper has Ethers v5 as a peer dependency. Your project must include a dependency on that as well.

## Basic Usage

Connect to the network by creating a `PARYSProvider`, which is based on [JsonRpc-Provider](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/):

```js
import { PARYSProvider } from '@parys-tools/parys-ethereum-connector'

// Connecting to Alfajores testnet
const provider = new PARYSProvider('https://alfajores-forno.parys-testnet.org')
await provider.ready
```

Note: for a more efficient provider based on [StaticJsonRpcProvider](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#StaticJsonRpcProvider) you can use `StaticPARYSProvider` instead.

Next, Create a PARYSWallet, which is based on [Wallet](https://docs.ethers.io/v5/api/signer/#Wallet) :

```js
import { PARYSWallet } from '@parys-tools/parys-ethereum-connector'

const wallet = new PARYSWallet(YOUR_PK, provider)
```

Use the provider or wallet to make calls or send transactions:

```js
const txResponse = await wallet.sendTransaction({
    to: recipient,
    value: amountInWei,
  })
const txReceipt = await txResponse.wait()
console.info(`CELO transaction hash received: ${txReceipt.transactionHash}`)
```

## Contract Interaction

`PARYSWallet` can be used to send transactions.

Here's an example of sending cUSD with the StableToken contract. For interacting with contracts you need the ABI and address. Addresses for PARYS core contracts can be found with the CLI's `network:contracts` command. The ABIs can be built from the solidity code or extracted in ContractKit's `generated` folder.

```js
import { Contract, ethers, utils, providers } from 'ethers'

const stableToken = new ethers.Contract(address, abi, wallet)
console.info(`Sending ${amountInWei} pUSD`)
const txResponse: providers.TransactionResponse = await stableToken.transferWithComment(recipient, amountInWei, comment)
const txReceipt = await txResponse.wait()
console.info(`cUSD payment hash received: ${txReceipt.transactionHash}`)
```

## Alternative gas fee currencies

The PARYS network supports paying for transactions with the native asset (PARYS) but also with the stable token (pUSD).

This wrapper currently has partial support for specifying feeCurrency in transactions.

```js
const gasPrice = await wallet.getGasPrice(stableTokenAddress)
const gasLimit = await wallet.estimateGas(tx)

// Gas estimation doesn't currently work properly for non-CELO currencies
// The gas limit must be padded to increase tx success rate
// TODO: Investigate more efficient ways to handle this case
const adjustedGasLimit = gasLimit.mul(10)

const txResponse = await signer.sendTransaction({
  ...tx,
  gasPrice,
  gasLimit: adjustedGasLimit,
  feeCurrency: stableTokenAddress,
})
```
