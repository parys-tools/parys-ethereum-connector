import { providers } from "ethers";
import { PARYSProvider } from "./PARYSProvider";

// An extension of PARYSProvider that mimics StaticJsonRpcProvider to avoid
// unnecessary network traffic on static nodes
// See https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#StaticJsonRpcProvider
export class StaticPARYSProvider extends PARYSProvider {
  detectNetwork = providers.StaticJsonRpcProvider.prototype.detectNetwork;
}
