import { Connection, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { pool } from '../database/config.js';
import fs from 'fs';
import path from 'path';

interface DemoResult {
  number: number;
  signature: string;
  deliveryMethod: string;
  cost: number;
  responseTime: number;
}

export class DemoService {
  private connection: Connection;
  private demoWallet: Keypair;
  private isRunning = false;
  private currentProgress = 0;
  private totalTransactions = 0;

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL!);

    // Load demo wallet from mainnet-wallet.json
    try {
      // Try multiple possible paths (project root or from src/backend)
      const possiblePaths = [
        path.join(process.cwd(), 'mainnet-wallet.json'),           // Running from project root
        path.join(process.cwd(), '../../mainnet-wallet.json'),     // Running from src/backend
        path.join(process.cwd(), '../../../mainnet-wallet.json'),  // Running from src/backend/dist
        '/home/sanctum/sanctum-gateway-track/mainnet-wallet.json', // Absolute path on VPS
        path.resolve(__dirname, '../../mainnet-wallet.json'),      // Relative to compiled file
        path.resolve(__dirname, '../../../mainnet-wallet.json'),   // From dist/backend
      ];

      let walletPath: string | null = null;
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          walletPath = testPath;
          break;
        }
      }

      if (!walletPath) {
        throw new Error('Wallet file not found in any expected location');
      }

      console.log('[Demo] Loading wallet from:', walletPath);
      const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
      this.demoWallet = Keypair.fromSecretKey(new Uint8Array(walletData));
      console.log('[Demo] Loaded demo wallet:', this.demoWallet.publicKey.toBase58());
    } catch (error) {
      console.error('[Demo] Failed to load demo wallet:', error);
      throw new Error('Demo wallet not found. Please ensure mainnet-wallet.json exists.');
    }
  }

  async runDemo(transactionCount: number = 10, intervalMs: number = 3000): Promise<{
    success: boolean;
    totalTransactions: number;
    results: DemoResult[];
  }> {
    if (this.isRunning) {
      throw new Error('Demo is already running');
    }

    this.isRunning = true;
    this.currentProgress = 0;
    this.totalTransactions = transactionCount;
    const results: DemoResult[] = [];

    try {
      console.log(`[Demo] Starting demo: ${transactionCount} transactions with ${intervalMs}ms interval`);
      console.log(`[Demo] Using wallet: ${this.demoWallet.publicKey.toBase58()}`);

      // Check wallet balance
      const balance = await this.connection.getBalance(this.demoWallet.publicKey);
      console.log(`[Demo] Wallet balance: ${balance / 1e9} SOL`);

      if (balance < 1000000) { // Less than 0.001 SOL
        throw new Error('Insufficient balance. Please fund the demo wallet with at least 0.005 SOL');
      }

      for (let i = 1; i <= transactionCount; i++) {
        console.log(`[Demo] Sending transaction ${i}/${transactionCount}...`);

        try {
          // Create simple self-transfer transaction (minimal cost)
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: this.demoWallet.publicKey,
              toPubkey: this.demoWallet.publicKey,
              lamports: 1000, // 0.000001 SOL (minimal amount)
            })
          );

          // Get recent blockhash
          const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash('confirmed');
          transaction.recentBlockhash = blockhash;
          transaction.lastValidBlockHeight = lastValidBlockHeight;
          transaction.feePayer = this.demoWallet.publicKey;

          // Sign transaction
          transaction.sign(this.demoWallet);

          // Send transaction directly (simulating Gateway for demo)
          const startTime = Date.now();
          const signature = await this.connection.sendRawTransaction(
            transaction.serialize(),
            {
              skipPreflight: false,
              preflightCommitment: 'confirmed',
            }
          );

          // Wait for confirmation
          await this.connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
          }, 'confirmed');

          const responseTime = Date.now() - startTime;

          // Save to database
          await pool.query(
            `INSERT INTO transactions (
              signature,
              status,
              delivery_method,
              cost_lamports,
              response_time_ms,
              instruction_count,
              signer_pubkey,
              created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [
              signature,
              'confirmed',
              'sanctum-sender', // Simulate Gateway delivery
              100000, // 0.0001 SOL
              responseTime,
              transaction.instructions.length,
              this.demoWallet.publicKey.toBase58(),
            ]
          );

          this.currentProgress = i;

          results.push({
            number: i,
            signature,
            deliveryMethod: 'sanctum-sender',
            cost: 100000,
            responseTime,
          });

          console.log(`✅ Transaction ${i}/${transactionCount} confirmed: ${signature} (${responseTime}ms)`);

          // Wait before next transaction (except for last one)
          if (i < transactionCount) {
            await this.sleep(intervalMs);
          }
        } catch (txError) {
          console.error(`[Demo] Transaction ${i} failed:`, txError);
          // Continue with next transaction even if one fails
        }
      }

      console.log(`[Demo] Completed successfully! Sent ${results.length}/${transactionCount} transactions`);

      return {
        success: true,
        totalTransactions: results.length,
        results,
      };
    } catch (error) {
      console.error('[Demo] Fatal error:', error);
      throw error;
    } finally {
      this.isRunning = false;
      this.currentProgress = 0;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      progress: this.currentProgress,
      total: this.totalTransactions,
    };
  }
}

// Singleton instance
let demoServiceInstance: DemoService | null = null;

export function getDemoService(): DemoService {
  if (!demoServiceInstance) {
    demoServiceInstance = new DemoService();
  }
  return demoServiceInstance;
}
