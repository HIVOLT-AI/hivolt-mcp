import {
  Wormhole,
  TokenId,
  isTokenId,
  wormhole,
  TokenTransfer,
  AttestationId,
  amount,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import {
  createWrappedToken,
  getSigner,
  getTokenDecimals,
  isTokenWrapped,
} from "src/helpers/wormhole";
import { ChainSchema, NetworkSchema } from "src/types/chain";
import { z } from "zod";

const WormholeTransferTokenToolParams = z.object({
  destinationChain: ChainSchema,
  tokenAddress: z.string(),
  network: NetworkSchema,
  transferAmount: z.string(),
});

export type WormholeTransferTokenToolParams = z.infer<
  typeof WormholeTransferTokenToolParams
>;

export const WormholeTransferTokenTool = {
  name: "WORMHOLE_TRANSFER_TOKEN",
  description:
    "Transfer a token from Solana as source chain to another destination chain using Wormhole",
  parameters: {
    destinationChain: ChainSchema,
    tokenAddress: z.string(),
    network: NetworkSchema,
    transferAmount: z.string(),
  },
  execute: async ({
    destinationChain,
    tokenAddress,
    network,
    transferAmount,
  }: WormholeTransferTokenToolParams) => {
    try {
      const wh = await wormhole(network || "Mainnet", [evm, solana]);
      const sourceChainName = "Solana";
      const destinationChainName = destinationChain;

      const sendChain = wh.getChain(sourceChainName);
      const source = await getSigner(sendChain);

      const rcvChain = wh.getChain(destinationChainName);
      const destination = await getSigner(rcvChain);

      let token: TokenId;

      if (!tokenAddress) {
        token = Wormhole.tokenId(sendChain.chain, "native");
      } else if (typeof tokenAddress === "string") {
        token = Wormhole.tokenId(sendChain.chain, tokenAddress);
      } else if (isTokenId(tokenAddress)) {
        token = tokenAddress;
      } else {
        token = Wormhole.tokenId(sendChain.chain, "native");
      }

      if (token.address !== "native") {
        const tokenAddressStr = token.address.toString();

        const isWrapped = await isTokenWrapped(
          wh,
          sourceChainName,
          destinationChainName,
          tokenAddressStr
        );

        if (!isWrapped) {
          const wrappedTokenResult = await createWrappedToken(
            destinationChainName,
            tokenAddressStr,
            network || "Testnet"
          );

          if (!wrappedTokenResult.success) {
            throw new Error(
              `Failed to create wrapped token: ${wrappedTokenResult.error}`
            );
          }
        }
      }

      const amt = transferAmount ?? "0.01";
      const automatic = false;

      const decimals = await getTokenDecimals(wh, token, sendChain);

      // Create a TokenTransfer object to track the state of the transfer
      const xfer = await wh.tokenTransfer(
        token,
        amount.units(amount.parse(amt, decimals)),
        source.address,
        destination.address,
        automatic
      );

      const quote = await TokenTransfer.quoteTransfer(
        wh,
        source.chain,
        destination.chain,
        xfer.transfer
      );

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

      let attestation: AttestationId[] | null = null;
      let attempts = 0;
      const maxAttempts = 10;

      while (!attestation && attempts < maxAttempts) {
        try {
          attestation = await xfer.fetchAttestation(60_000);
        } catch (_) {
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
    } catch (error: any) {
      return error.message;
    }
  },
} as const;
