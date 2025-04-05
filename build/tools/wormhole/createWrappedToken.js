"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WormholeCreateWrappedTokenTool = void 0;
const zod_1 = require("zod");
const sdk_1 = require("@wormhole-foundation/sdk");
const evm_1 = __importDefault(require("@wormhole-foundation/sdk/evm"));
const solana_1 = __importDefault(require("@wormhole-foundation/sdk/solana"));
const chain_1 = require("../../types/chain");
const wormhole_1 = require("../../helpers/wormhole");
const WormholeCreateWrappedTokenToolParams = zod_1.z.object({
    destinationChain: chain_1.ChainSchema,
    tokenAddress: zod_1.z.string(),
    network: chain_1.NetworkSchema,
});
exports.WormholeCreateWrappedTokenTool = {
    name: "WORMHOLE_CREATE_WRAPPED_TOKEN",
    description: "Create a wrapped token on a destination chain for a token from Solana as source chain using Wormhole",
    parameters: {
        destinationChain: chain_1.ChainSchema,
        tokenAddress: zod_1.z.string(),
        network: chain_1.NetworkSchema,
    },
    execute: async ({ destinationChain, tokenAddress, network, }) => {
        try {
            const gasLimit = BigInt(2500000);
            const wh = await (0, sdk_1.wormhole)(network || "Mainnet", [evm_1.default, solana_1.default]);
            // Get chain contexts
            const srcChain = wh.getChain("Solana");
            const destChain = wh.getChain(destinationChain);
            // Check if token is already wrapped
            const wrapped = await (0, wormhole_1.isTokenWrapped)(wh, "Solana", destinationChain, tokenAddress);
            if (wrapped) {
                return {
                    success: true,
                    wrappedToken: {
                        chain: destinationChain,
                        address: wrapped,
                    },
                };
            }
            // Destination chain signer setup
            const { signer: destSigner } = await (0, wormhole_1.getSigner)(destChain, gasLimit);
            const tbDest = await destChain.getTokenBridge();
            // Source chain signer setup
            const { signer: origSigner } = await (0, wormhole_1.getSigner)(srcChain);
            // Create an attestation transaction on the source chain
            const tbOrig = await srcChain.getTokenBridge();
            // Parse the address properly for the source chain
            const parsedTokenAddress = sdk_1.Wormhole.parseAddress(srcChain.chain, tokenAddress);
            const signerAddress = sdk_1.Wormhole.parseAddress(origSigner.chain(), origSigner.address());
            // Create the attestation transaction
            const attestTxns = tbOrig.createAttestation(parsedTokenAddress, signerAddress);
            // Sign and send the attestation transaction
            const txids = await (0, sdk_1.signSendWait)(srcChain, attestTxns, origSigner);
            const txid = txids[0].txid;
            // Retrieve the Wormhole message ID from the attestation transaction
            const msgs = await srcChain.parseTransaction(txid);
            if (!msgs || msgs.length === 0) {
                throw new Error("No messages found in the transaction");
            }
            // Wait for the VAA to be available
            const timeout = 25 * 60 * 1000;
            const vaa = await wh.getVaa(msgs[0], "TokenBridge:AttestMeta", timeout);
            if (!vaa) {
                throw new Error("VAA not found after retries exhausted. Try extending the timeout.");
            }
            // Submit the attestation on the destination chain
            const subAttestation = tbDest.submitAttestation(vaa, sdk_1.Wormhole.parseAddress(destSigner.chain(), destSigner.address()));
            (0, sdk_1.signSendWait)(destChain, subAttestation, destSigner);
            let wrappedAsset = null;
            let attempts = 0;
            const maxAttempts = 10;
            while (!wrappedAsset && attempts < maxAttempts) {
                try {
                    const tokenId = sdk_1.Wormhole.tokenId(srcChain.chain, tokenAddress);
                    wrappedAsset = await tbDest.getWrappedAsset(tokenId);
                }
                catch (_) {
                    attempts++;
                    await new Promise((r) => setTimeout(r, 2000));
                }
            }
            if (!wrappedAsset) {
                throw new Error("Failed to get wrapped asset after multiple attempts");
            }
            return {
                success: true,
                wrappedToken: {
                    chain: destinationChain,
                    address: wrappedAsset,
                },
                attestationTxid: txid,
            };
        }
        catch (error) {
            return error.message;
        }
    },
};
//# sourceMappingURL=createWrappedToken.js.map