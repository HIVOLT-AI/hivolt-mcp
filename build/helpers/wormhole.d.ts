import { ChainAddress, ChainContext, Network, Signer, Wormhole, Chain, TokenId, TokenAddress, UniversalAddress } from "@wormhole-foundation/sdk";
import { NetworkType } from "../types/chain";
import { CreateWrappedTokenResponse } from "../types/wormhole";
export declare function getSigner<N extends Network, C extends Chain>(chain: ChainContext<N, C>, gasLimit?: bigint): Promise<{
    chain: ChainContext<N, C>;
    signer: Signer<N, C>;
    address: ChainAddress<C>;
}>;
export declare function getTokenDecimals<N extends "Mainnet" | "Testnet" | "Devnet">(wh: Wormhole<N>, token: TokenId, sendChain: ChainContext<N, any>): Promise<number>;
export declare const isTokenWrapped: (wh: Wormhole<Network>, srcChain: Chain, destChain: Chain, tokenAddress: string) => Promise<TokenAddress<Chain> | UniversalAddress | null>;
export declare const createWrappedToken: (destinationChain: Chain, tokenAddress: string, network: NetworkType) => Promise<CreateWrappedTokenResponse>;
//# sourceMappingURL=wormhole.d.ts.map