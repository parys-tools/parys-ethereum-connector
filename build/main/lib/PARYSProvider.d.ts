import { BigNumber, providers, utils } from "ethers";
export declare class PARYSProvider extends providers.JsonRpcProvider {
    constructor(url?: utils.ConnectionInfo | string, network?: providers.Networkish);
    /**
     * Override to parse transaction correctly
     * https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
     */
    sendTransaction(signedTransaction: string | Promise<string>): Promise<providers.TransactionResponse>;
    /**
     * Override to handle alternative gas currencies
     * getGasPrice in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
     */
    getGasPrice(feeCurrencyAddress?: string): Promise<BigNumber>;
    /**
     * Override to handle alternative gas currencies
     * prepareRequest in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts
     */
    prepareRequest(method: any, params: any): [string, Array<any>];
}
