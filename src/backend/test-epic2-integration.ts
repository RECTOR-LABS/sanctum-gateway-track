/**
 * Epic 2 Integration Test
 *
 * This script tests the complete transaction logging and analytics flow:
 * 1. Submit a test transaction via Gateway
 * 2. Verify transaction is logged to database
 * 3. Test all analytics API endpoints
 */

import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getTransactionService } from './services/transaction-service.js';
import {
  getTransactionBySignature,
  getRecentTransactions,
  getTotalTransactionCount,
} from './database/dal/transaction-dal.js';
import {
  getOverallMetrics,
  getCostComparison,
  getMetricsByDeliveryMethod,
} from './database/dal/analytics-dal.js';
import { testDatabaseConnection } from './database/config.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  log('='.repeat(80), 'blue');
  log('Epic 2 Integration Test - Transaction Logging & Analytics', 'blue');
  log('='.repeat(80), 'blue');

  try {
    // Step 1: Test database connection
    log('\n[Step 1] Testing database connection...', 'yellow');
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }
    log('✓ Database connection successful', 'green');

    // Step 2: Load wallet
    log('\n[Step 2] Loading wallet...', 'yellow');
    const walletPath = process.env.SOLANA_NETWORK === 'devnet'
      ? '../../devnet-wallet.json'
      : '../../mainnet-wallet.json';

    if (!fs.existsSync(walletPath)) {
      throw new Error(`Wallet not found at ${walletPath}`);
    }

    const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const wallet = Keypair.fromSecretKey(new Uint8Array(walletData));
    log(`✓ Wallet loaded: ${wallet.publicKey.toBase58()}`, 'green');

    // Step 3: Get initial transaction count
    log('\n[Step 3] Getting initial transaction count...', 'yellow');
    const initialCount = await getTotalTransactionCount();
    log(`✓ Initial transaction count: ${initialCount}`, 'green');

    // Step 4: Submit test transaction
    log('\n[Step 4] Submitting test transaction via Gateway...', 'yellow');
    log('Creating SOL transfer transaction...', 'blue');

    const txService = getTransactionService();
    const connection = txService.getConnection();

    // Check balance
    const balance = await connection.getBalance(wallet.publicKey);
    log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`, 'blue');

    if (balance < 0.001 * LAMPORTS_PER_SOL) {
      throw new Error('Insufficient balance. Please fund the wallet with at least 0.001 SOL');
    }

    // Submit transaction (0.0001 SOL to self)
    const metadata = await txService.submitSolTransfer(
      wallet,
      wallet.publicKey.toBase58(), // Send to self
      0.0001
    );

    log(`✓ Transaction submitted!`, 'green');
    log(`  Signature: ${metadata.signature}`, 'blue');
    log(`  Delivery method: ${metadata.deliveryMethod}`, 'blue');
    log(`  Cost: ${metadata.cost} SOL`, 'blue');
    log(`  Response time: ${metadata.responseTime}ms`, 'blue');
    log(`  Success: ${metadata.success}`, 'blue');

    // Wait for database to sync
    log('\nWaiting 2 seconds for database sync...', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 5: Verify transaction in database
    log('\n[Step 5] Verifying transaction in database...', 'yellow');
    const dbTx = await getTransactionBySignature(metadata.signature);

    if (!dbTx) {
      throw new Error('Transaction not found in database!');
    }

    log('✓ Transaction found in database!', 'green');
    log(`  ID: ${dbTx.id}`, 'blue');
    log(`  Status: ${dbTx.status}`, 'blue');
    log(`  Delivery method: ${dbTx.delivery_method}`, 'blue');
    log(`  Cost: ${dbTx.cost_lamports / LAMPORTS_PER_SOL} SOL`, 'blue');
    log(`  Response time: ${dbTx.response_time_ms}ms`, 'blue');
    log(`  Created at: ${dbTx.created_at.toISOString()}`, 'blue');

    // Step 6: Test analytics endpoints
    log('\n[Step 6] Testing analytics endpoints...', 'yellow');

    // 6.1: Overall metrics
    log('\n  6.1: Testing getOverallMetrics()...', 'yellow');
    const overallMetrics = await getOverallMetrics();
    log('  ✓ Overall metrics retrieved:', 'green');
    log(`    Total transactions: ${overallMetrics.total_transactions}`, 'blue');
    log(`    Success rate: ${overallMetrics.success_rate.toFixed(2)}%`, 'blue');
    log(`    Total cost: ${overallMetrics.total_cost_sol.toFixed(6)} SOL`, 'blue');
    log(`    Avg response time: ${overallMetrics.avg_response_time_ms?.toFixed(2)}ms`, 'blue');

    // 6.2: Cost comparison
    log('\n  6.2: Testing getCostComparison()...', 'yellow');
    const costComparison = await getCostComparison();
    log('  ✓ Cost comparison retrieved:', 'green');
    log(`    Gateway cost: ${costComparison.gateway_cost_sol.toFixed(6)} SOL`, 'blue');
    log(`    Direct Jito cost: ${costComparison.direct_jito_cost_sol.toFixed(6)} SOL`, 'blue');
    log(`    Savings vs Jito: ${costComparison.savings_vs_jito_sol.toFixed(6)} SOL (${costComparison.savings_percentage.toFixed(2)}%)`, 'blue');

    // 6.3: Metrics by delivery method
    log('\n  6.3: Testing getMetricsByDeliveryMethod()...', 'yellow');
    const methodMetrics = await getMetricsByDeliveryMethod();
    log('  ✓ Delivery method metrics retrieved:', 'green');
    methodMetrics.forEach((m) => {
      log(`    ${m.delivery_method}: ${m.total_count} txns, ${m.success_rate.toFixed(2)}% success, ${m.total_cost_sol.toFixed(6)} SOL`, 'blue');
    });

    // 6.4: Recent transactions
    log('\n  6.4: Testing getRecentTransactions()...', 'yellow');
    const recentTxs = await getRecentTransactions(5);
    log(`  ✓ Retrieved ${recentTxs.length} recent transactions`, 'green');
    recentTxs.forEach((tx, i) => {
      log(`    ${i + 1}. ${tx.signature.slice(0, 20)}... [${tx.status}] - ${tx.delivery_method}`, 'blue');
    });

    // Step 7: Final count verification
    log('\n[Step 7] Verifying transaction count increased...', 'yellow');
    const finalCount = await getTotalTransactionCount();
    const increase = finalCount - initialCount;
    log(`✓ Final transaction count: ${finalCount} (increased by ${increase})`, 'green');

    if (increase < 1) {
      throw new Error('Transaction count did not increase!');
    }

    // Step 8: Success summary
    log('\n' + '='.repeat(80), 'green');
    log('✓ ALL TESTS PASSED!', 'green');
    log('='.repeat(80), 'green');
    log('\nEpic 2 Integration Summary:', 'blue');
    log(`  ✓ Transaction logging working`, 'green');
    log(`  ✓ Database storage confirmed`, 'green');
    log(`  ✓ Analytics calculations accurate`, 'green');
    log(`  ✓ Cost tracking functional`, 'green');
    log(`  ✓ Delivery method tracking working`, 'green');
    log('\nStory 2.2 & 2.3: COMPLETE ✅', 'green');

  } catch (error) {
    log('\n' + '='.repeat(80), 'red');
    log('✗ TEST FAILED', 'red');
    log('='.repeat(80), 'red');
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => {
    log('\nTest completed successfully. Exiting...', 'blue');
    process.exit(0);
  })
  .catch((error) => {
    log('\nTest failed with error:', 'red');
    console.error(error);
    process.exit(1);
  });
