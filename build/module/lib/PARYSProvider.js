import { BigNumber, providers, utils } from "ethers";
import { parsePARYSTransaction } from "./transactions";
export class PARYSProvider extends providers.JsonRpcProvider {
    constructor(url, network) {
        super(url, network);
        // Override certain block formatting properties that don't exist on PARYS blocks
        // Reaches into https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/formatter.ts
        const blockFormat = this.formatter.formats.block;
        blockFormat.gasLimit = () => BigNumber.from(0);
        blockFormat.nonce = () => "";
        blockFormat.difficulty = () => 0;
    }
    /**
     * Override to parse transaction correctly
     * https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
     */
    async sendTransaction(signedTransaction) {
        await this.getNetwork();
        const signedTx = await Promise.resolve(signedTransaction);
        const hexTx = utils.hexlify(signedTx);
        const tx = parsePARYSTransaction(signedTx);
        try {
            const hash = await this.perform("sendTransaction", {
                signedTransaction: hexTx,
            });
            return this._wrapTransaction(tx, hash);
        }
        catch (error) {
            error.transaction = tx;
            error.transactionHash = tx.hash;
            throw error;
        }
    }
    /**
     * Override to handle alternative gas currencies
     * getGasPrice in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
     */
    async getGasPrice(feeCurrencyAddress) {
        await this.getNetwork();
        const params = feeCurrencyAddress ? { feeCurrencyAddress } : {};
        return BigNumber.from(await this.perform("getGasPrice", params));
    }
    /**
     * Override to handle alternative gas currencies
     * prepareRequest in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts
     */
    prepareRequest(method, params) {
        if (method === "getGasPrice") {
            const param = params.feeCurrencyAddress
                ? [params.feeCurrencyAddress]
                : [];
            return ["eth_gasPrice", param];
        }
        return super.prepareRequest(method, params);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUEFSWVNQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvUEFSWVNQcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDckQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdkQsTUFBTSxPQUFPLGFBQWMsU0FBUSxTQUFTLENBQUMsZUFBZTtJQUMxRCxZQUNFLEdBQW1DLEVBQ25DLE9BQThCO1FBRTlCLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFcEIsZ0ZBQWdGO1FBQ2hGLHlHQUF5RztRQUN6RyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDakQsV0FBVyxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLFdBQVcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQzdCLFdBQVcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsZUFBZSxDQUNuQixpQkFBMkM7UUFFM0MsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDeEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDMUQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QyxNQUFNLEVBQUUsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxJQUFJO1lBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO2dCQUNqRCxpQkFBaUIsRUFBRSxLQUFLO2FBQ3pCLENBQUMsQ0FBQztZQUNILE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN4QztRQUFDLE9BQU8sS0FBVSxFQUFFO1lBQ25CLEtBQUssQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztZQUNoQyxNQUFNLEtBQUssQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsa0JBQTJCO1FBQzNDLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3hCLE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNoRSxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7O09BR0c7SUFDSCxjQUFjLENBQUMsTUFBVyxFQUFFLE1BQVc7UUFDckMsSUFBSSxNQUFNLEtBQUssYUFBYSxFQUFFO1lBQzVCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0I7Z0JBQ3JDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNQLE9BQU8sQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDaEM7UUFFRCxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRiJ9