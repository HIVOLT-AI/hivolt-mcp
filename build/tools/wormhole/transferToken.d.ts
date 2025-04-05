import { z } from "zod";
declare const WormholeTransferTokenToolParams: z.ZodObject<{
    destinationChain: z.ZodUnion<[z.ZodLiteral<"Solana">, z.ZodLiteral<"Ethereum">]>;
    tokenAddress: z.ZodString;
    network: z.ZodUnion<[z.ZodLiteral<"Mainnet">, z.ZodLiteral<"Testnet">, z.ZodLiteral<"Devnet">]>;
    transferAmount: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tokenAddress: string;
    destinationChain: "Solana" | "Ethereum";
    network: "Mainnet" | "Testnet" | "Devnet";
    transferAmount: string;
}, {
    tokenAddress: string;
    destinationChain: "Solana" | "Ethereum";
    network: "Mainnet" | "Testnet" | "Devnet";
    transferAmount: string;
}>;
export type WormholeTransferTokenToolParams = z.infer<typeof WormholeTransferTokenToolParams>;
export declare const WormholeTransferTokenTool: {
    readonly name: "WORMHOLE_TRANSFER_TOKEN";
    readonly description: "Transfer a token from Solana as source chain to another destination chain using Wormhole";
    readonly parameters: {
        readonly destinationChain: z.ZodUnion<[z.ZodLiteral<"Solana">, z.ZodLiteral<"Ethereum">]>;
        readonly tokenAddress: z.ZodString;
        readonly network: z.ZodUnion<[z.ZodLiteral<"Mainnet">, z.ZodLiteral<"Testnet">, z.ZodLiteral<"Devnet">]>;
        readonly transferAmount: z.ZodString;
    };
    readonly execute: ({ destinationChain, tokenAddress, network, transferAmount, }: WormholeTransferTokenToolParams) => Promise<any>;
};
export {};
//# sourceMappingURL=transferToken.d.ts.map