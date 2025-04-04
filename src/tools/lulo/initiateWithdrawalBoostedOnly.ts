import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Connection, Keypair, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import axios from 'axios';
import { RPC_URL } from 'src/constants/rpc';
import { ENV } from 'src/env';
import { LULO_API_URI } from 'src/constants/lulo';
import { z } from 'zod';

const LuloInitiateWithdrawalBoostedOnlyToolParams = z.object({
	mintAddress: z.string(),
	amount: z.number(),
});

export type LuloInitiateWithdrawalBoostedOnlyToolParams = z.infer<
	typeof LuloInitiateWithdrawalBoostedOnlyToolParams
>;

export const LuloInitiateWithdrawalBoostedOnlyTool = {
	name: 'LULO_INITIATE_WITHDRAWAL_BOOSTED_ONLY',
	description: 'Initiate withdrawal boosted only',
	parameters: {
		mintAddress: z.string(),
		amount: z.number(),
	},
	execute: async (input: LuloInitiateWithdrawalBoostedOnlyToolParams) => {
		const secretKey = bs58.decode(ENV.SOLANA_ACCOUNT_PRIVATE_KEY);
		const connection = new Connection(RPC_URL.HELIUS);
		const keypair = Keypair.fromSecretKey(secretKey);

		return await lulo_initiate_withdrawal_boosted_only(
			keypair,
			connection,
			input.mintAddress,
			input.amount,
		);
	},
};

export async function lulo_initiate_withdrawal_boosted_only(
	accountKeypair: Keypair,
	connection: Connection,
	mintAddress: string,
	amount: number,
): Promise<{ txId: string }> {
 try {
	 const client = axios.create({
		 baseURL: LULO_API_URI,
	 });
	 const response = await client.post('/v1/generate.transactions.initiateRegularWithdraw?priorityFee=500000', {
		 owner: accountKeypair.publicKey.toBase58(),
		 mintAddress: mintAddress, // USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
		 amount: amount,
	 }, {
		 headers: {
			 'Content-Type': 'application/json',
			 'x-api-key': ENV.LULO_API_KEY ?? '',
		 },
	 });

	 const txBuffer = Buffer.from(response.data.trasnaction, 'base64');
	 const tx = VersionedTransaction.deserialize(txBuffer);
	 const { blockhash } = await connection.getLatestBlockhash();

	 const messages = tx.message;
	 
	 const instructions = messages.compiledInstructions.map((ix) => {
		 return new TransactionInstruction({
			 programId: messages.staticAccountKeys[ix.programIdIndex],
			 keys: ix.accountKeyIndexes.map((i) => ({
				 pubkey: messages.staticAccountKeys[i],
				 isSigner: messages.isAccountSigner(i),
				 isWritable: messages.isAccountWritable(i),
			 })),
			 data: Buffer.from(ix.data as any, 'base64'),
		 });
	 });

	 const newMessage = new TransactionMessage({
		 payerKey: accountKeypair.publicKey,
		 recentBlockhash: blockhash,
		 instructions,
	 }).compileToV0Message();

	 const newTx = new VersionedTransaction(newMessage);

	 newTx.sign([accountKeypair]);

	 const txId = await connection.sendTransaction(newTx, {
		 maxRetries: 3,
	 });
	 
	 return { txId };
 } catch (error: any) {
	 throw new Error(`Failed to initiate withdrawal boosted only: ${error.message}`);
 }
}
