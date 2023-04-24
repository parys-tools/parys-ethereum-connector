"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARYSProvider = void 0;
const ethers_1 = require("ethers");
const transactions_1 = require("./transactions");
class PARYSProvider extends ethers_1.providers.JsonRpcProvider {
    constructor(url, network) {
        super(url, network);
        // Override certain block formatting properties that don't exist on PARYS blocks
        // Reaches into https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/formatter.ts
        const blockFormat = this.formatter.formats.block;
        blockFormat.gasLimit = () => ethers_1.BigNumber.from(0);
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
        const hexTx = ethers_1.utils.hexlify(signedTx);
        const tx = transactions_1.parsePARYSTransaction(signedTx);
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
        return ethers_1.BigNumber.from(await this.perform("getGasPrice", params));
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
exports.PARYSProvider = PARYSProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUEFSWVNQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvUEFSWVNQcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBcUQ7QUFDckQsaURBQXVEO0FBRXZELE1BQWEsYUFBYyxTQUFRLGtCQUFTLENBQUMsZUFBZTtJQUMxRCxZQUNFLEdBQW1DLEVBQ25DLE9BQThCO1FBRTlCLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFcEIsZ0ZBQWdGO1FBQ2hGLHlHQUF5RztRQUN6RyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDakQsV0FBVyxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxrQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxXQUFXLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUM3QixXQUFXLENBQUMsVUFBVSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGVBQWUsQ0FDbkIsaUJBQTJDO1FBRTNDLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3hCLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFELE1BQU0sS0FBSyxHQUFHLGNBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEMsTUFBTSxFQUFFLEdBQUcsb0NBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsSUFBSTtZQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtnQkFDakQsaUJBQWlCLEVBQUUsS0FBSzthQUN6QixDQUFDLENBQUM7WUFDSCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDeEM7UUFBQyxPQUFPLEtBQVUsRUFBRTtZQUNuQixLQUFLLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDaEMsTUFBTSxLQUFLLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsV0FBVyxDQUFDLGtCQUEyQjtRQUMzQyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN4QixNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDaEUsT0FBTyxrQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVEOzs7T0FHRztJQUNILGNBQWMsQ0FBQyxNQUFXLEVBQUUsTUFBVztRQUNyQyxJQUFJLE1BQU0sS0FBSyxhQUFhLEVBQUU7WUFDNUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLGtCQUFrQjtnQkFDckMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDO2dCQUM3QixDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ1AsT0FBTyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNoQztRQUVELE9BQU8sS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUNGO0FBOURELHNDQThEQyJ9