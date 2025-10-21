import { Connection, Transaction, PublicKey, Keypair } from '@solana/web3.js';
import type {
  TransactionMetadata,
  CuPriceLevel,
  JitoTipLevel,
} from '../../shared/types/gateway.js';
import { GatewayClient, createGatewayClient } from '../gateway/client.js';
import {
  buildGatewayTransaction,
  sendTransaction,
  createTestTransaction,
} from '../gateway/transaction.js';
import {
  createTransaction,
  updateTransaction,
  getTransactionBySignature,
} from '../database/dal/transaction-dal.js';
import type { CreateTransactionInput } from '../database/types/index.js';
import { getWebSocketService } from './websocket-service.js';

/**
 * Transaction Service
 * High-level abstraction for submitting transactions via Gateway
 * This is the main API the rest of the application will use
 */
export class TransactionService {
  private gatewayClient: GatewayClient;
  private connection: Connection;

  constructor(gatewayClient?: GatewayClient, rpcUrl?: string) {
    this.gatewayClient = gatewayClient || createGatewayClient();

    // Use standard Solana RPC for blockchain operations (NOT Gateway URL)
    // Gateway is only for transaction optimization/submission
    const connectionUrl =
      rpcUrl ||
      process.env.SOLANA_RPC_URL ||
      'https://api.mainnet-beta.solana.com';

    this.connection = new Connection(connectionUrl, 'confirmed');
  }

  /**
   * Submit a transaction via Gateway
   * This is the main method for sending transactions
   *
   * Logs all transaction data to database for analytics
   */
  async submitTransaction(
    transaction: Transaction,
    signer: Keypair,
    options?: {
      cuPrice?: CuPriceLevel;
      jitoTip?: JitoTipLevel;
      deliveryDelay?: number;
      expirySlots?: number;
    }
  ): Promise<TransactionMetadata> {
    const startTime = Date.now();
    let signature = '';
    let status: 'pending' | 'confirmed' | 'failed' = 'pending';
    let errorMessage: string | undefined;
    let errorCode: string | undefined;

    try {
      console.log(`[TransactionService] Building transaction for ${signer.publicKey.toBase58()}`);

      // Build Gateway transaction
      const { transaction: modifiedTx, blockhash, lastValidBlockHeight } =
        await buildGatewayTransaction(
          this.gatewayClient,
          this.connection,
          transaction,
          signer.publicKey
        );

      console.log(`[TransactionService] Transaction built. Blockhash: ${blockhash}`);

      // Sign the modified transaction
      modifiedTx.sign(signer);

      // Send via Gateway
      const metadata = await sendTransaction(this.gatewayClient, modifiedTx);

      signature = metadata.signature;
      status = metadata.success ? 'confirmed' : 'failed';

      if (!metadata.success && metadata.error) {
        errorMessage = metadata.error;
        errorCode = 'SEND_FAILED';
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log(`[TransactionService] Transaction sent. Signature: ${signature}, Status: ${status}, Response time: ${responseTime}ms`);

      // Store transaction in database for analytics
      const txInput: CreateTransactionInput = {
        signature: signature || 'unknown',
        status,
        delivery_method: metadata.deliveryMethod || 'sanctum-sender',
        cost_lamports: Math.floor(metadata.cost * 1_000_000_000), // Convert SOL to lamports
        tip_lamports: options?.jitoTip ? 100_000 : undefined, // Estimate based on tip level
        tip_refunded: false, // Will be updated later if Jito refunds
        response_time_ms: responseTime,
        confirmation_time_ms: undefined, // Will be updated when confirmed
        blockhash,
        last_valid_block_height: lastValidBlockHeight,
        instruction_count: transaction.instructions.length,
        signer_pubkey: signer.publicKey.toBase58(),
        error_code: errorCode,
        error_message: errorMessage,
        project_id: null, // Multi-project support in Epic 5
        raw_transaction_data: {
          instructions: transaction.instructions.length,
          feePayer: signer.publicKey.toBase58(),
        },
        gateway_response: {
          deliveryMethod: metadata.deliveryMethod,
          cost: metadata.cost,
          responseTime: metadata.responseTime,
          timestamp: metadata.timestamp,
        },
      };

      try {
        const dbRecord = await createTransaction(txInput);
        console.log(`[TransactionService] Transaction logged to database. ID: ${dbRecord.id}`);

        // Emit real-time event to WebSocket clients
        const wsService = getWebSocketService();
        wsService.emitTransactionCreated(dbRecord);

        // Emit specific event based on status
        if (dbRecord.status === 'confirmed') {
          wsService.emitTransactionConfirmed(dbRecord);
        } else if (dbRecord.status === 'failed') {
          wsService.emitTransactionFailed(dbRecord);
        }
      } catch (dbError) {
        console.error('[TransactionService] Failed to log transaction to database:', dbError);
        // Don't throw - transaction was successful even if logging failed
      }

      return metadata;
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.error('[TransactionService] Transaction submission failed:', error);

      // Log failed transaction to database
      const txInput: CreateTransactionInput = {
        signature: signature || `failed-${Date.now()}`,
        status: 'failed',
        delivery_method: 'rpc',
        cost_lamports: 0,
        response_time_ms: responseTime,
        instruction_count: transaction.instructions.length,
        signer_pubkey: signer.publicKey.toBase58(),
        error_code: 'SUBMISSION_FAILED',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        raw_transaction_data: {
          instructions: transaction.instructions.length,
          feePayer: signer.publicKey.toBase58(),
        },
      };

      try {
        const dbRecord = await createTransaction(txInput);
        console.log('[TransactionService] Failed transaction logged to database');

        // Emit real-time event for failed transaction
        const wsService = getWebSocketService();
        wsService.emitTransactionFailed(dbRecord);
      } catch (dbError) {
        console.error('[TransactionService] Failed to log error to database:', dbError);
      }

      throw error;
    }
  }

  /**
   * Submit a simple SOL transfer via Gateway (useful for testing)
   */
  async submitSolTransfer(
    fromKeypair: Keypair,
    toAddress: string,
    amountSol: number,
    options?: {
      cuPrice?: CuPriceLevel;
      jitoTip?: JitoTipLevel;
    }
  ): Promise<TransactionMetadata> {
    const toPubkey = new PublicKey(toAddress);
    const transaction = createTestTransaction(
      fromKeypair.publicKey,
      toPubkey,
      amountSol
    );

    return this.submitTransaction(transaction, fromKeypair, options);
  }

  /**
   * Get the Solana connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Get the Gateway client instance
   */
  getGatewayClient(): GatewayClient {
    return this.gatewayClient;
  }
}

/**
 * Create a singleton transaction service instance
 */
let transactionServiceInstance: TransactionService | null = null;

export function getTransactionService(): TransactionService {
  if (!transactionServiceInstance) {
    transactionServiceInstance = new TransactionService();
  }
  return transactionServiceInstance;
}
