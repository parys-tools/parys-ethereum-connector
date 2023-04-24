import { providers } from "ethers";
import { PARYSProvider } from "./PARYSProvider";
// An extension of PARYSProvider that mimics StaticJsonRpcProvider to avoid
// unnecessary network traffic on static nodes
// See https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#StaticJsonRpcProvider
export class StaticPARYSProvider extends PARYSProvider {
    constructor() {
        super(...arguments);
        this.detectNetwork = providers.StaticJsonRpcProvider.prototype.detectNetwork;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljUEFSWVNQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvU3RhdGljUEFSWVNQcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVoRCwyRUFBMkU7QUFDM0UsOENBQThDO0FBQzlDLHNGQUFzRjtBQUN0RixNQUFNLE9BQU8sbUJBQW9CLFNBQVEsYUFBYTtJQUF0RDs7UUFDRSxrQkFBYSxHQUFHLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO0lBQzFFLENBQUM7Q0FBQSJ9