import {
  Connection,
  Transaction,
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import type {
  TransactionMetadata,
} from '../../shared/types/gateway.js';
import { GatewayClient } from './client.js';

/**
 * Build a Gateway-optimized transaction
 *
 * This calls Gateway's buildGatewayTransaction API which adds tip instructions
 * and optimizations automatically. The returned transaction must be signed
 * before sending.
 *
 * @param gatewayClient Gateway client instance
 * @param connection Solana connection for blockhash
 * @param transaction The transaction to build (unsigned)
 * @param feePayer The fee payer public key
 * @returns Object with modified transaction and blockhash info
 */
export async function buildGatewayTransaction(
  gatewayClient: GatewayClient,
  connection: Connection,
  transaction: Transaction,
  feePayer: PublicKey
): Promise<{ transaction: Transaction; blockhash: string; lastValidBlockHeight: number }> {
  // Get latest blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  // Set transaction properties
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = feePayer;

  // Serialize the unsigned transaction
  const unsignedSerialized = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });
  const unsignedBase64 = unsignedSerialized.toString('base64');

  // Call Gateway's buildGatewayTransaction API
  const buildResult = await gatewayClient.buildGatewayTransaction(unsignedBase64);

  // Deserialize the modified transaction Gateway returns
  const modifiedTxBuffer = Buffer.from(buildResult.transaction, 'base64');
  const modifiedTransaction = Transaction.from(modifiedTxBuffer);

  return {
    transaction: modifiedTransaction,
    blockhash: buildResult.latestBlockhash.blockhash,
    lastValidBlockHeight: buildResult.latestBlockhash.lastValidBlockHeight,
  };
}

/**
 * Send a transaction via Gateway's sendTransaction method
 * Returns transaction metadata for tracking/analytics
 *
 * @param gatewayClient Gateway client instance
 * @param signedTransaction Signed transaction (base64 or Transaction object)
 * @returns Transaction metadata including signature and delivery info
 */
export async function sendTransaction(
  gatewayClient: GatewayClient,
  signedTransaction: string | Transaction
): Promise<TransactionMetadata> {
  const startTime = Date.now();

  try {
    // Convert Transaction object to base64 if needed
    let base64Tx: string;
    if (typeof signedTransaction === 'string') {
      base64Tx = signedTransaction;
    } else {
      const serialized = signedTransaction.serialize({ requireAllSignatures: true });
      base64Tx = serialized.toString('base64');
    }

    // Call Gateway sendTransaction API
    const signature = await gatewayClient.sendTransaction(base64Tx);

    const endTime = Date.now();

    // Return transaction metadata
    // Note: Gateway's sendTransaction returns just the signature
    // Additional metadata would come from other Gateway endpoints
    return {
      signature,
      deliveryMethod: 'sanctum-sender', // Based on configured delivery methods
      cost: 0.0001, // Sanctum Sender costs 0.0001 SOL per transaction
      success: true,
      timestamp: new Date(),
      responseTime: endTime - startTime,
    };
  } catch (error) {
    const endTime = Date.now();

    return {
      signature: '',
      deliveryMethod: 'rpc',
      cost: 0,
      success: false,
      timestamp: new Date(),
      responseTime: endTime - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Helper: Create a simple SOL transfer transaction for testing
 */
export function createTestTransaction(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  amountSol: number
): Transaction {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: amountSol * LAMPORTS_PER_SOL,
    })
  );

  return transaction;
}

/**
 * Helper: Generate a test keypair (for testing only!)
 */
export function generateTestKeypair(): Keypair {
  return Keypair.generate();
}
