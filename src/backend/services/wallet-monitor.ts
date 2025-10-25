/**
 * Wallet Monitoring Service
 *
 * Monitors Solana wallet addresses for new transactions and automatically
 * saves them to the database for analytics.
 */

import { Connection, PublicKey, ConfirmedSignatureInfo } from '@solana/web3.js';
import { createTransaction } from '../database/dal/transaction-dal.js';
import { getWebSocketService, WSEventType } from './websocket-service.js';
import type { DeliveryMethod } from '../database/types/index.js';

interface MonitoredWallet {
  address: string;
  publicKey: PublicKey;
  lastSignature?: string; // Last processed transaction signature
  isActive: boolean;
  startedAt: Date;
}

class WalletMonitorService {
  private connection: Connection;
  private monitoredWallets: Map<string, MonitoredWallet> = new Map();
  private pollingInterval: NodeJS.Timeout | null = null;
  private readonly POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '60000'); // Poll every 60 seconds (configurable)
  private readonly MAX_TRANSACTIONS_PER_POLL = parseInt(process.env.MAX_TRANSACTIONS_PER_POLL || '5'); // Fetch fewer transactions
  private readonly REQUEST_DELAY_MS = parseInt(process.env.REQUEST_DELAY_MS || '300'); // Delay between requests
  private readonly MAX_WALLETS = parseInt(process.env.MAX_MONITORED_WALLETS || '3'); // Maximum wallets to monitor simultaneously

  constructor() {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  /**
   * Add a wallet address to monitor
   */
  async addWallet(address: string): Promise<{ success: boolean; message: string; currentCount?: number; maxWallets?: number }> {
    try {
      // Validate address
      const publicKey = new PublicKey(address);

      // Check if already monitoring
      if (this.monitoredWallets.has(address)) {
        return {
          success: false,
          message: 'Wallet is already being monitored',
          currentCount: this.monitoredWallets.size,
          maxWallets: this.MAX_WALLETS,
        };
      }

      // Check if max wallet limit reached
      if (this.monitoredWallets.size >= this.MAX_WALLETS) {
        return {
          success: false,
          message: `Maximum wallet limit reached (${this.MAX_WALLETS} wallets). Please stop monitoring another wallet first.`,
          currentCount: this.monitoredWallets.size,
          maxWallets: this.MAX_WALLETS,
        };
      }

      // Add to monitoring list
      this.monitoredWallets.set(address, {
        address,
        publicKey,
        isActive: true,
        startedAt: new Date(),
      });

      console.log(`[WalletMonitor] Started monitoring wallet: ${address}`);

      // Start polling if not already running
      if (!this.pollingInterval) {
        this.startPolling();
      }

      // Immediately fetch recent transactions
      await this.fetchRecentTransactions(address);

      return {
        success: true,
        message: 'Wallet monitoring started successfully',
        currentCount: this.monitoredWallets.size,
        maxWallets: this.MAX_WALLETS,
      };
    } catch (error) {
      console.error('[WalletMonitor] Error adding wallet:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Invalid wallet address',
      };
    }
  }

  /**
   * Remove a wallet from monitoring
   */
  removeWallet(address: string): boolean {
    const removed = this.monitoredWallets.delete(address);

    if (removed) {
      console.log(`[WalletMonitor] Stopped monitoring wallet: ${address}`);

      // Stop polling if no wallets left
      if (this.monitoredWallets.size === 0 && this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
        console.log('[WalletMonitor] Polling stopped (no wallets to monitor)');
      }
    }

    return removed;
  }

  /**
   * Get list of monitored wallets
   */
  getMonitoredWallets(): Array<{ address: string; startedAt: Date; isActive: boolean }> {
    return Array.from(this.monitoredWallets.values()).map(wallet => ({
      address: wallet.address,
      startedAt: wallet.startedAt,
      isActive: wallet.isActive,
    }));
  }

  /**
   * Get current wallet count and limit
   */
  getWalletStats(): { currentCount: number; maxWallets: number; canAddMore: boolean } {
    return {
      currentCount: this.monitoredWallets.size,
      maxWallets: this.MAX_WALLETS,
      canAddMore: this.monitoredWallets.size < this.MAX_WALLETS,
    };
  }

  /**
   * Start polling for new transactions
   */
  private startPolling() {
    console.log('[WalletMonitor] Starting transaction polling...');

    this.pollingInterval = setInterval(async () => {
      for (const [address, wallet] of this.monitoredWallets) {
        if (wallet.isActive) {
          await this.checkForNewTransactions(address);
        }
      }
    }, this.POLL_INTERVAL_MS);
  }

  /**
   * Fetch recent transactions for a wallet (initial load)
   */
  private async fetchRecentTransactions(address: string) {
    try {
      const wallet = this.monitoredWallets.get(address);
      if (!wallet) return;

      console.log(`[WalletMonitor] Fetching recent transactions for ${address}`);

      const signatures = await this.connection.getSignaturesForAddress(
        wallet.publicKey,
        { limit: this.MAX_TRANSACTIONS_PER_POLL }
      );

      if (signatures.length > 0) {
        // Process transactions in reverse order (oldest first)
        for (let i = signatures.length - 1; i >= 0; i--) {
          await this.processTransaction(signatures[i], address);
        }

        // Update last signature
        wallet.lastSignature = signatures[0].signature;
        console.log(`[WalletMonitor] Processed ${signatures.length} transactions for ${address}`);
      }
    } catch (error) {
      console.error(`[WalletMonitor] Error fetching recent transactions for ${address}:`, error);
    }
  }

  /**
   * Check for new transactions since last poll
   */
  private async checkForNewTransactions(address: string) {
    try {
      const wallet = this.monitoredWallets.get(address);
      if (!wallet) return;

      const options = wallet.lastSignature
        ? { until: wallet.lastSignature, limit: this.MAX_TRANSACTIONS_PER_POLL }
        : { limit: this.MAX_TRANSACTIONS_PER_POLL };

      const signatures = await this.connection.getSignaturesForAddress(
        wallet.publicKey,
        options
      );

      if (signatures.length > 0) {
        console.log(`[WalletMonitor] Found ${signatures.length} new transactions for ${address}`);

        // Process new transactions
        for (let i = signatures.length - 1; i >= 0; i--) {
          await this.processTransaction(signatures[i], address);
        }

        // Update last signature
        wallet.lastSignature = signatures[0].signature;
      }
    } catch (error) {
      console.error(`[WalletMonitor] Error checking for new transactions for ${address}:`, error);
    }
  }

  /**
   * Process a single transaction
   */
  private async processTransaction(signatureInfo: ConfirmedSignatureInfo, walletAddress: string) {
    try {
      const { signature, slot, blockTime, confirmationStatus, err } = signatureInfo;

      // Determine status
      const status = err ? 'failed' : (confirmationStatus === 'finalized' || confirmationStatus === 'confirmed' ? 'confirmed' : 'pending');

      // Try to get detailed transaction info
      let deliveryMethod = 'unknown';
      let costLamports = 0;
      let instructionCount = 1;

      try {
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, this.REQUEST_DELAY_MS));

        const txDetails = await this.connection.getParsedTransaction(signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (txDetails) {
          instructionCount = txDetails.transaction.message.instructions.length;
          costLamports = txDetails.meta?.fee || 0;

          // Try to detect if transaction went through Gateway (has 5+ instructions typically)
          if (instructionCount >= 5) {
            deliveryMethod = 'sanctum-sender'; // Likely Gateway transaction
          } else if (instructionCount >= 3) {
            deliveryMethod = 'jito'; // Possibly Jito
          } else {
            deliveryMethod = 'rpc'; // Standard RPC
          }
        }
      } catch (detailError) {
        console.log(`[WalletMonitor] Could not fetch details for ${signature}, using basic info`);
      }

      // Save to database
      const transaction = await createTransaction({
        signature,
        status,
        delivery_method: deliveryMethod as DeliveryMethod,
        cost_lamports: costLamports,
        instruction_count: instructionCount,
        signer_pubkey: walletAddress,
        slot: slot || undefined,
        block_time: blockTime ? new Date(blockTime * 1000) : undefined,
        error_message: err ? JSON.stringify(err) : undefined,
      });

      console.log(`[WalletMonitor] Saved transaction ${signature} (${status}) for ${walletAddress}`);

      // Broadcast via WebSocket
      const wsService = getWebSocketService();
      wsService.broadcast({
        type: WSEventType.TRANSACTION_CREATED,
        data: {
          id: transaction.id,
          signature: transaction.signature,
          status: transaction.status,
          delivery_method: transaction.delivery_method,
          cost_sol: transaction.cost_lamports / 1_000_000_000,
          signer_pubkey: transaction.signer_pubkey,
          created_at: transaction.created_at.toISOString(),
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      // Ignore duplicate key errors (transaction already exists)
      if (error instanceof Error && error.message.includes('duplicate key')) {
        return;
      }
      console.error(`[WalletMonitor] Error processing transaction ${signatureInfo.signature}:`, error);
    }
  }

  /**
   * Stop all monitoring
   */
  stopAll() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.monitoredWallets.clear();
    console.log('[WalletMonitor] All monitoring stopped');
  }
}

// Singleton instance
let monitorServiceInstance: WalletMonitorService | null = null;

export function getWalletMonitorService(): WalletMonitorService {
  if (!monitorServiceInstance) {
    monitorServiceInstance = new WalletMonitorService();
  }
  return monitorServiceInstance;
}
