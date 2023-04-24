import { utils, Wallet } from "ethers";
import { serializePARYSTransaction, } from "./transactions";
const logger = new utils.Logger("PARYSWallet");
const forwardErrors = [
    utils.Logger.errors.INSUFFICIENT_FUNDS,
    utils.Logger.errors.NONCE_EXPIRED,
    utils.Logger.errors.REPLACEMENT_UNDERPRICED,
];
export class PARYSWallet extends Wallet {
    /**
     * Override to skip checkTransaction step which rejects PARYS tx properties
     * https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts
     */
    async populateTransaction(transaction) {
        const tx = await utils.resolveProperties(transaction);
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
                return logger.throwError("cannot estimate gas; transaction may fail or may require manual gas limit", utils.Logger.errors.UNPREDICTABLE_GAS_LIMIT, {
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
        return utils.resolveProperties(tx);
    }
    /**
     * Override to serialize transaction using custom serialize method
     * https://github.com/ethers-io/ethers.js/blob/master/packages/wallet/src.ts/index.ts
     */
    async signTransaction(transaction) {
        const tx = await this.populateTransaction(transaction);
        if (tx.from != null) {
            if (utils.getAddress(tx.from) !== this.address) {
                logger.throwArgumentError("transaction from address mismatch", "transaction.from", transaction.from);
            }
            delete tx.from;
        }
        const signature = this._signingKey().signDigest(utils.keccak256(serializePARYSTransaction(tx)));
        const serialized = serializePARYSTransaction(tx, signature);
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
        const tx = await utils.resolveProperties(transaction);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUEFSWVNXYWxsZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL1BBUllTV2FsbGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBd0IsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM3RCxPQUFPLEVBRUwseUJBQXlCLEdBQzFCLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRS9DLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQjtJQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhO0lBQ2pDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLHVCQUF1QjtDQUM1QyxDQUFDO0FBRUYsTUFBTSxPQUFPLFdBQVksU0FBUSxNQUFNO0lBQ3JDOzs7T0FHRztJQUNILEtBQUssQ0FBQyxtQkFBbUIsQ0FDdkIsV0FBc0Q7UUFFdEQsTUFBTSxFQUFFLEdBQVEsTUFBTSxLQUFLLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFM0QsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLElBQUksRUFBRTtZQUNqQixFQUFFLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsSUFBSSxFQUFFLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtZQUN2QixFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNsQztRQUNELElBQUksRUFBRSxDQUFDLEtBQUssSUFBSSxJ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