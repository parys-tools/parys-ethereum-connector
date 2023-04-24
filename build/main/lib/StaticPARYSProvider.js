"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticPARYSProvider = void 0;
const ethers_1 = require("ethers");
const PARYSProvider_1 = require("./PARYSProvider");
// An extension of PARYSProvider that mimics StaticJsonRpcProvider to avoid
// unnecessary network traffic on static nodes
// See https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#StaticJsonRpcProvider
class StaticPARYSProvider extends PARYSProvider_1.PARYSProvider {
    constructor() {
        super(...arguments);
        this.detectNetwork = ethers_1.providers.StaticJsonRpcProvider.prototype.detectNetwork;
    }
}
exports.StaticPARYSProvider = StaticPARYSProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljUEFSWVNQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvU3RhdGljUEFSWVNQcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsbURBQWdEO0FBRWhELDJFQUEyRTtBQUMzRSw4Q0FBOEM7QUFDOUMsc0ZBQXNGO0FBQ3RGLE1BQWEsbUJBQW9CLFNBQVEsNkJBQWE7SUFBdEQ7O1FBQ0Usa0JBQWEsR0FBRyxrQkFBUyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7SUFDMUUsQ0FBQztDQUFBO0FBRkQsa0RBRUMifQ==