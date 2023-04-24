import { BigNumber, BigNumberish, BytesLike, providers, Transaction, utils } from "ethers";
declare type SignatureLike = {
    r: string;
    s?: string;
    _vs?: string;
    recoveryParam?: number;
    v?: number;
} | BytesLike;
export interface PARYSTransactionRequest extends providers.TransactionRequest {
    feeCurrency?: string;
    gatewayFeeRecipient?: string;
    gatewayFee?: BigNumberish;
}
export interface PARYSTransaction extends Transaction {
    feeCurrency?: string;
    gatewayFeeRecipient?: string;
    gatewayFee?: BigNumber;
}
export declare const parysTransactionFields: ({
    name: string;
    maxLength: number;
    numeric: boolean;
    length?: undefined;
} | {
    name: string;
    length: number;
    maxLength?: undefined;
    numeric?: undefined;
} | {
    name: string;
    maxLength?: undefined;
    numeric?: undefined;
    length?: undefined;
})[];
export declare const parysAllowedTransactionKeys: {
    [key: string]: boolean;
};
export declare function serializePARYSTransaction(transaction: any, signature?: SignatureLike): string;
export declare function parsePARYSTransaction(rawTransaction: utils.BytesLike): PARYSTransaction;
export {};
