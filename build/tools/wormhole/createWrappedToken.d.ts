import { z } from "zod";
declare const WormholeCreateWrappedTokenToolParams: z.ZodObject<{
    destinationChain: z.ZodUnion<[z.ZodLiteral<"Solana">, z.ZodLiteral<"Ethereum">]>;
    tokenAddress: z.ZodString;
    network: z.ZodUnion<[z.ZodLiteral<"Mainnet">, z.ZodLiteral<"Testnet">, z.ZodLiteral<"Devnet">]>;
}, "strip", z.ZodTypeAny, {
    tokenAddress: string;
    destinationChain: "Solana" | "Ethereum";
    network: "Mainnet" | "Testnet" | "Devnet";
}, {
    tokenAddress: string;
    destinationChain: "Solana" | "Ethereum";
    network: "Mainnet" | "Testnet" | "Devnet";
}>;
export type WormholeCreateWrappedTokenToolParams = z.infer<typeof WormholeCreateWrappedTokenToolParams>;
export declare const WormholeCreateWrappedTokenTool: {
    readonly name: "WORMHOLE_CREATE_WRAPPED_TOKEN";
    readonly description: "Create a wrapped token on a destination chain for a token from Solana as source chain using Wormhole";
    readonly parameters: {
        readonly destinationChain: z.ZodUnion<[z.ZodLiteral<"Solana">, z.ZodLiteral<"Ethereum">]>;
        readonly tokenAddress: z.ZodString;
        readonly network: z.ZodUnion<[z.ZodLiteral<"Mainnet">, z.ZodLiteral<"Testnet">, z.ZodLiteral<"Devnet">]>;
    };
    readonly execute: ({ destinationChain, tokenAddress, network, }: WormholeCreateWrappedTokenToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=createWrappedToken.d.ts.map