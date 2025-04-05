import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { RPC_URL } from "../../constants/rpc";
import { ENV } from "../../env";
import { z } from "zod";
import { BN } from "@coral-xyz/anchor";
import {
  CREATE_CPMM_POOL_FEE_ACC,
  CREATE_CPMM_POOL_PROGRAM,
  Raydium,
  TxVersion,
} from "@raydium-io/raydium-sdk-v2";
import { MintLayout } from "@solana/spl-token";
import Decimal from "decimal.js";

const RaydiumCreateCpmmToolParams = z.object({
  mintA: z.string(),
  mintB: z.string(),
  configId: z.string(),
  mintAAmount: z.string(),
  mintBAmount: z.string(),
  startTime: z.string(),
});

export type RaydiumCreateCpmmToolParams = z.infer<
  typeof RaydiumCreateCpmmToolParams
>;

export const RaydiumCreateCpmmTool = {
  name: "RAYDIUM_CREATE_CPMM",
  description: "Create CPMM pool",
  parameters: {
    mintA: z.string(),
    mintB: z.string(),
    configId: z.string(),
    mintAAmount: z.string(),
    mintBAmount: z.string(),
    startTime: z.string(),
  },
  execute: async (input: RaydiumCreateCpmmToolParams) => {
    const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
    const connection = new Connection(RPC_URL.HELIUS);
    const keypair = Keypair.fromSecretKey(secretKey);

    return await raydium_create_cpmm(
      keypair,
      connection,
      new PublicKey(input.mintA),
      new PublicKey(input.mintB),
      new PublicKey(input.configId),
      new BN(input.mintAAmount),
      new BN(input.mintBAmount),
      new BN(input.startTime)
    );
  },
};

export async function raydium_create_cpmm(
  accountKeypair: Keypair,
  connection: Connection,
  mintA: PublicKey,
  mintB: PublicKey,
  configId: PublicKey,
  mintAAmount: BN,
  mintBAmount: BN,
  startTime: BN
): Promise<{ txId: string }> {
  try {
    const raydium = await Raydium.load({
      owner: accountKeypair.publicKey,
      connection,
    });

    const [mintInfoA, mintInfoB] = await connection.getMultipleAccountsInfo([
      mintA,
      mintB,
    ]);
    if (mintInfoA === null || mintInfoB === null) {
      throw Error("fetch mint info error");
    }

    const mintDecodeInfoA = MintLayout.decode(mintInfoA.data);
    const mintDecodeInfoB = MintLayout.decode(mintInfoB.data);

    const mintFormatInfoA = {
      chainId: 101,
      address: mintA.toString(),
      programId: mintInfoA.owner.toString(),
      logoURI: "",
      symbol: "",
      name: "",
      decimals: mintDecodeInfoA.decimals,
      tags: [],
      extensions: {},
    };
    const mintFormatInfoB = {
      chainId: 101,
      address: mintB.toString(),
      programId: mintInfoB.owner.toString(),
      logoURI: "",
      symbol: "",
      name: "",
      decimals: mintDecodeInfoB.decimals,
      tags: [],
      extensions: {},
    };

    const response = await raydium.cpmm.createPool({
      programId: CREATE_CPMM_POOL_PROGRAM,
      poolFeeAccount: CREATE_CPMM_POOL_FEE_ACC,
      mintA: mintFormatInfoA,
      mintB: mintFormatInfoB,
      mintAAmount,
      mintBAmount,
      startTime,
      //@ts-expect-error sdk bug
      feeConfig: { id: configId.toString() },
      associatedOnly: false,
      ownerInfo: {
        useSOLBalance: true,
      },
      txVersion: TxVersion.V0,
      // computeBudgetConfig: {
      //   units: 600000,
      //   microLamports: 46591500,
      // },
    });

    response.transaction.sign([accountKeypair]);

    const txId = await connection.sendTransaction(response.transaction, {
      maxRetries: 3,
    });

    return { txId };
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to create CPMM pool: ${error.message}`);
  }
}
