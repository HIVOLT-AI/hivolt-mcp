import { z } from "zod";
import {
  Wormhole,
  Chain,
  TokenAddress,
  wormhole,
  signSendWait,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import { ChainSchema, NetworkSchema } from "../../types/chain";
import { getSigner, isTokenWrapped } from "../../helpers/wormhole";

const WormholeCreateWrappedTokenToolParams = z.object({
  destinationChain: ChainSchema,
  tokenAddress: z.string(),
  network: NetworkSchema,
});

export type WormholeCreateWrappedTokenToolParams = z.infer<
  typeof WormholeCreateWrappedTokenToolParams
>;

export const WormholeCreateWrappedTokenTool = {
  name: "WORMHOLE_CREATE_WRAPPED_TOKEN",
  description:
    "Create a wrapped token on a destination chain for a token from Solana as source chain using Wormhole",
  parameters: {
    destinationChain: ChainSchema,
    tokenAddress: z.string(),
    network: NetworkSchema,
  },
  execute: async ({
    destinationChain,
    tokenAddress,
    network,
  }: WormholeCreateWrappedTokenToolParams) => {
    try {
      const gasLimit = BigInt(2_500_000);

      const wh = await wormhole(network || "Mainnet", [evm, solana]);

      // Get chain contexts
      const srcChain = wh.getChain("Solana");
      const destChain = wh.getChain(destinationChain);

      // Check if token is already wrapped
      const wrapped = await isTokenWrapped(
        wh,
        "Solana",
        destinationChain,
        tokenAddress
      );
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
      const { signer: destSigner } = await getSigner(destChain, gasLimit);
      const tbDest = await destChain.getTokenBridge();

      // Source chain signer setup
      const { signer: origSigner } = await getSigner(srcChain);

      // Create an attestation transaction on the source chain
      const tbOrig = await srcChain.getTokenBridge();

      // Parse the address properly for the source chain
      const parsedTokenAddress = Wormhole.parseAddress(
        srcChain.chain,
        tokenAddress
      );
      const signerAddress = Wormhole.parseAddress(
        origSigner.chain(),
        origSigner.address()
      );

      // Create the attestation transaction
      const attestTxns = tbOrig.createAttestation(
        parsedTokenAddress,
        signerAddress
      );

      // Sign and send the attestation transaction
      const txids = await signSendWait(srcChain, attestTxns, origSigner);
      const txid = txids[0]!.txid;

      // Retrieve the Wormhole message ID from the attestation transaction
      const msgs = await srcChain.parseTransaction(txid);

      if (!msgs || msgs.length === 0) {
        throw new Error("No messages found in the transaction");
      }

      // Wait for the VAA to be available
      const timeout = 25 * 60 * 1000;
      const vaa = await wh.getVaa(msgs[0]!, "TokenBridge:AttestMeta", timeout);
      if (!vaa) {
        throw new Error(
          "VAA not found after retries exhausted. Try extending the timeout."
        );
      }

      // Submit the attestation on the destination chain
      const subAttestation = tbDest.submitAttestation(
        vaa,
        Wormhole.parseAddress(destSigner.chain(), destSigner.address())
      );

      signSendWait(destChain, subAttestation, destSigner);

      let wrappedAsset: TokenAddress<Chain> | null = null;
      let attempts = 0;
      const maxAttempts = 10;

      while (!wrappedAsset && attempts < maxAttempts) {
        try {
          const tokenId = Wormhole.tokenId(srcChain.chain, tokenAddress);
          wrappedAsset = await tbDest.getWrappedAsset(tokenId);
        } catch (_) {
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
    } catch (error: any) {
      return error.message;
    }
  },
} as const;
