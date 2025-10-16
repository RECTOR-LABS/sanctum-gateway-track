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
    try {
      // Sign the transaction
      transaction.sign(signer);

      // Build (serialize) the transaction for Gateway
      const base64Tx = await buildGatewayTransaction(
        this.connection,
        transaction,
        signer.publicKey
      );

      // Send via Gateway
      const metadata = await sendTransaction(this.gatewayClient, base64Tx, options);

      // TODO: Store metadata in database for analytics (Epic 2)
      console.log('Transaction metadata:', metadata);

      return metadata;
    } catch (error) {
      console.error('Transaction submission failed:', error);
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
