"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WormholeTransferTokenTool = void 0;
const sdk_1 = require("@wormhole-foundation/sdk");
const evm_1 = __importDefault(require("@wormhole-foundation/sdk/evm"));
const solana_1 = __importDefault(require("@wormhole-foundation/sdk/solana"));
const wormhole_1 = require("../../helpers/wormhole");
const chain_1 = require("../../types/chain");
const zod_1 = require("zod");
const WormholeTransferTokenToolParams = zod_1.z.object({
    destinationChain: chain_1.ChainSchema,
    tokenAddress: zod_1.z.string(),
    network: chain_1.NetworkSchema,
    transferAmount: zod_1.z.string(),
});
exports.WormholeTransferTokenTool = {
    name: "WORMHOLE_TRANSFER_TOKEN",
    description: "Transfer a token from Solana as source chain to another destination chain using Wormhole",
    parameters: {
        destinationChain: chain_1.ChainSchema,
        tokenAddress: zod_1.z.string(),
        network: chain_1.NetworkSchema,
        transferAmount: zod_1.z.string(),
    },
    execute: async ({ destinationChain, tokenAddress, network, transferAmount, }) => {
        try {
            const wh = await (0, sdk_1.wormhole)(network || "Mainnet", [evm_1.default, solana_1.default]);
            const sourceChainName = "Solana";
            const destinationChainName = destinationChain;
            const sendChain = wh.getChain(sourceChainName);
            const source = await (0, wormhole_1.getSigner)(sendChain);
            const rcvChain = wh.getChain(destinationChainName);
            const destination = await (0, wormhole_1.getSigner)(rcvChain);
            let token;
            if (!tokenAddress) {
                token = sdk_1.Wormhole.tokenId(sendChain.chain, "native");
            }
            else if (typeof tokenAddress === "string") {
                token = sdk_1.Wormhole.tokenId(sendChain.chain, tokenAddress);
            }
            else if ((0, sdk_1.isTokenId)(tokenAddress)) {
                token = tokenAddress;
            }
            else {
                token = sdk_1.Wormhole.tokenId(sendChain.chain, "native");
            }
            if (token.address !== "native") {
                const tokenAddressStr = token.address.toString();
                const isWrapped = await (0, wormhole_1.isTokenWrapped)(wh, sourceChainName, destinationChainName, tokenAddressStr);
                if (!isWrapped) {
                    const wrappedTokenResult = await (0, wormhole_1.createWrappedToken)(destinationChainName, tokenAddressStr, network || "Testnet");
                    if (!wrappedTokenResult.success) {
                        throw new Error(`Failed to create wrapped token: ${wrappedTokenResult.error}`);
                    }
                }
            }
            const amt = transferAmount ?? "0.01";
            const automatic = false;
            const decimals = await (0, wormhole_1.getTokenDecimals)(wh, token, sendChain);
            // Create a TokenTransfer object to track the state of the transfer
            const xfer = await wh.tokenTransfer(token, sdk_1.amount.units(sdk_1.amount.parse(amt, decimals)), source.address, destination.address, automatic);
            const quote = await sdk_1.TokenTransfer.quoteTransfer(wh, source.chain, destination.chain, xfer.transfer);
            if (xfer.transfer.automatic && quote.destinationToken.amount < 0) {
                throw "The amount requested is too low to cover the fee and any native gas requested.";
            }
            const srcTxids = await xfer.initiateTransfer(source.signer);
            if (automatic) {
                return {
                    success: true,
                    srcTxIds: srcTxids,
                    dstTxIds: [],
                    transferId: xfer.txids[0],
                };
            }
            let attestation = null;
            let attempts = 0;
            const maxAttempts = 10;
            while (!attestation && attempts < maxAttempts) {
                try {
                    attestation = await xfer.fetchAttestation(60000);
                }
                catch (_) {
                    attempts++;
                    await new Promise((resolve) => setTimeout(resolve, 30000));
                }
            }
            if (!attestation) {
                throw new Error("Failed to get attestation after multiple attempts");
            }
            const destTxids = await xfer.completeTransfer(destination.signer);
            return {
                success: true,
                srcTxIds: srcTxids,
                dstTxIds: destTxids,
                transferId: xfer.txids[0],
            };
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=transferToken.js.map