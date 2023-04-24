import { BigNumber, providers, utils, Wallet } from "ethers";
import { PARYSTransactionRequest } from "./transactions";
export declare class PARYSWallet extends Wallet {
    /**
     * Override to skip checkTransaction step which rejects PARYS tx properties
     * https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts
     */
    populateTransaction(transaction: utils.Deferrable<PARYSTransactionRequest>): Promise<any>;
    /**
     * Override to serialize transaction using custom serialize method
     * https://github.com/ethers-io/ethers.js/blob/master/packages/wallet/src.ts/index.ts
     */
    signTransaction(transaction: PARYSTransactionRequest): Promise<string>;
    /**
     * Override just for type fix
     * https://github.com/ethers-io/ethers.js/blob/master/packages/wallet/src.ts/index.ts
     */
    sendTransaction(transaction: utils.Deferrable<PARYSTransactionRequest>): Promise<providers.TransactionResponse>;
    /**
     * Override to skip checkTransaction step which rejects PARYS tx properties
     * https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts
     */
    estimateGas(transaction: utils.Deferrable<PARYSTransactionRequest>): Promise<BigNumber>;
    /**
     * Override to support alternative gas currencies
     * https://github.com/parys-tools/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts
     */
    getGasPrice(feeCurrencyAddress?: string): Promise<BigNumber>;
}
