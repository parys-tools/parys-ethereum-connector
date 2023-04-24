import { providers } from "ethers";
import { PARYSProvider } from "./PARYSProvider";
export declare class StaticPARYSProvider extends PARYSProvider {
    detectNetwork: () => Promise<providers.Network>;
}
