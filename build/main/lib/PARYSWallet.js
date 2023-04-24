"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARYSWallet = void 0;
const ethers_1 = require("ethers");
const transactions_1 = require("./transactions");
const logger = new ethers_1.utils.Logger("PARYSWallet");
const forwardErrors = [
    ethers_1.utils.Logger.errors.INSUFFICIENT_FUNDS,
    ethers_1.utils.Logger.errors.NONCE_EXPIRED,
    ethers_1.utils.Logger.errors.REPLACEMENT_UNDERPRICED,
];
class PARYSWallet extends ethers_1.Wallet {
    /**
     * Override to skip checkTransaction step which rejects PARYS tx properties
     * https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts
     */
    async populateTransaction(transaction) {
        const tx = await ethers_1.utils.resolveProperties(transaction);
        if (tx.to != null) {
            tx.to = Promise.resolve(tx.to).then((to) => this.resolveName(to));
        }
        if (tx.gasPrice == null) {
            tx.gasPrice = this.getGasPrice();
        }
        if (tx.nonce == null) {
            tx.nonce = this.getTransactionCount("pending");
        }
        if (tx.gasLimit == null) {
            tx.gasLimit = this.estimateGas(tx).catch((error) => {
                if (forwardErrors.indexOf(error.code) >= 0) {
                    throw error;
                }
                return logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", ethers_1.utils.Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
                    error: error,
                    tx: tx,
                });
            });
        }
        if (tx.chainId == null) {
            tx.chainId = this.getChainId();
        }
        else {
            tx.chainId = Promise.all([
                Promise.resolve(tx.chainId),
                this.getChainId(),
            ]).then((results) => {
                if (results[1] !== 0 && results[0] !== results[1]) {
                    logger.throwArgumentError("chainId address mismatch", "transaction", transaction);
                }
                return results[0];
            });
        }
        return ethers_1.utils.resolveProperties(tx);
    }
    /**
     * Override to serialize transaction using custom serialize method
     * https://github.com/ethers-io/ethers.js/blob/master/packages/wallet/src.ts/index.ts
     */
    async signTransaction(transaction) {
        const tx = await this.populateTransaction(transaction);
        if (tx.from != null) {
            if (ethers_1.utils.getAddress(tx.from) !== this.address) {
                logger.throwArgumentError("transaction from address mismatch", "transaction.from", transaction.from);
            }
            delete tx.from;
        }
        const signature = this._signingKey().signDigest(ethers_1.utils.keccak256(transactions_1.serializePARYSTransaction(tx)));
        const serialized = transactions_1.serializePARYSTransaction(tx, signature);
        return serialized;
    }
    /**
     * Override just for type fix
     * https://github.com/ethers-io/ethers.js/blob/master/packages/wallet/src.ts/index.ts
     */
    sendTransaction(transaction) {
        return super.sendTransaction(transaction);
    }
    /**
     * Override to skip checkTransaction step which rejects PARYS tx properties
     * https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts
     */
    async estimateGas(transaction) {
        this._checkProvider("estimateGas");
        const tx = await ethers_1.utils.resolveProperties(transaction);
        return await this.provider.estimateGas(tx);
    }
    /**
     * Override to support alternative gas currencies
     * https://github.com/parys-tools/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts
     */
    async getGasPrice(feeCurrencyAddress) {
        this._checkProvider("getGasPrice");
        // @ts-ignore
        return await this.provider.getGasPrice(feeCurrencyAddress);
    }
}
exports.PARYSWallet = PARYSWallet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUEFSWVNXYWxsZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL1BBUllTV2FsbGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUE2RDtBQUM3RCxpREFHd0I7QUFFeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRS9DLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLGNBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQjtJQUN0QyxjQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhO0lBQ2pDLGNBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLHVCQUF1QjtDQUM1QyxDQUFDO0FBRUYsTUFBYSxXQUFZLFNBQVEsZUFBTTtJQUNyQzs7O09BR0c7SUFDSCxLQUFLLENBQUMsbUJBQW1CLENBQ3ZCLFdBQXNEO1FBRXRELE1BQU0sRUFBRSxHQUFRLE1BQU0sY0FBSyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTNELElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxJQUFJLEVBQUU7WUFDakIsRUFBRSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuRTtRQUNELElBQUksRUFBRSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFDdkIsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbEM7UUFDRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NB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