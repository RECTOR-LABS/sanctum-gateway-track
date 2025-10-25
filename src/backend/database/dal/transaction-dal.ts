/**
 * Transaction Data Access Layer (DAL)
 *
 * Provides type-safe CRUD operations for the transactions table.
 * All database queries go through this layer for consistency and maintainability.
 */

import { pool } from '../config.js';
import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
  PaginatedResponse,
} from '../types/index.js';

/**
 * Create a new transaction record
 */
export async function createTransaction(
  input: CreateTransactionInput
): Promise<Transaction> {
  const query = `
    INSERT INTO transactions (
      signature,
      status,
      delivery_method,
      cost_lamports,
      tip_lamports,
      tip_refunded,
      response_time_ms,
      confirmation_time_ms,
      slot,
      block_time,
      blockhash,
      last_valid_block_height,
      instruction_count,
      signer_pubkey,
      error_code,
      error_message,
      project_id,
      raw_transaction_data,
      gateway_response
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING *
  `;

  const values = [
    input.signature,
    input.status,
    input.delivery_method,
    input.cost_lamports,
    input.tip_lamports ?? null,
    input.tip_refunded ?? false,
    input.response_time_ms ?? null,
    input.confirmation_time_ms ?? null,
    input.slot ?? null,
    input.block_time ?? null,
    input.blockhash ?? null,
    input.last_valid_block_height ?? null,
    input.instruction_count,
    input.signer_pubkey,
    input.error_code ?? null,
    input.error_message ?? null,
    input.project_id ?? null,
    input.raw_transaction_data ? JSON.stringify(input.raw_transaction_data) : null,
    input.gateway_response ? JSON.stringify(input.gateway_response) : null,
  ];

  const result = await pool.query(query, values);
  return mapRowToTransaction(result.rows[0]);
}

/**
 * Get transaction by signature
 */
export async function getTransactionBySignature(
  signature: string
): Promise<Transaction | null> {
  const query = 'SELECT * FROM transactions WHERE signature = $1';
  const result = await pool.query(query, [signature]);

  if (result.rows.length === 0) {
    return null;
  }

  return mapRowToTransaction(result.rows[0]);
}

/**
 * Get transaction by ID
 */
export async function getTransactionById(id: number): Promise<Transaction | null> {
  const query = 'SELECT * FROM transactions WHERE id = $1';
  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    return null;
  }

  return mapRowToTransaction(result.rows[0]);
}

/**
 * Update transaction by signature
 */
export async function updateTransaction(
  input: UpdateTransactionInput
): Promise<Transaction | null> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Build dynamic UPDATE query based on provided fields
  if (input.status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    values.push(input.status);
  }
  if (input.delivery_method !== undefined) {
    updates.push(`delivery_method = $${paramIndex++}`);
    values.push(input.delivery_method);
  }
  if (input.cost_lamports !== undefined) {
    updates.push(`cost_lamports = $${paramIndex++}`);
    values.push(input.cost_lamports);
  }
  if (input.tip_lamports !== undefined) {
    updates.push(`tip_lamports = $${paramIndex++}`);
    values.push(input.tip_lamports);
  }
  if (input.tip_refunded !== undefined) {
    updates.push(`tip_refunded = $${paramIndex++}`);
    values.push(input.tip_refunded);
  }
  if (input.response_time_ms !== undefined) {
    updates.push(`response_time_ms = $${paramIndex++}`);
    values.push(input.response_time_ms);
  }
  if (input.confirmation_time_ms !== undefined) {
    updates.push(`confirmation_time_ms = $${paramIndex++}`);
    values.push(input.confirmation_time_ms);
  }
  if (input.slot !== undefined) {
    updates.push(`slot = $${paramIndex++}`);
    values.push(input.slot);
  }
  if (input.block_time !== undefined) {
    updates.push(`block_time = $${paramIndex++}`);
    values.push(input.block_time);
  }
  if (input.blockhash !== undefined) {
    updates.push(`blockhash = $${paramIndex++}`);
    values.push(input.blockhash);
  }
  if (input.last_valid_block_height !== undefined) {
    updates.push(`last_valid_block_height = $${paramIndex++}`);
    values.push(input.last_valid_block_height);
  }
  if (input.instruction_count !== undefined) {
    updates.push(`instruction_count = $${paramIndex++}`);
    values.push(input.instruction_count);
  }
  if (input.signer_pubkey !== undefined) {
    updates.push(`signer_pubkey = $${paramIndex++}`);
    values.push(input.signer_pubkey);
  }
  if (input.error_code !== undefined) {
    updates.push(`error_code = $${paramIndex++}`);
    values.push(input.error_code);
  }
  if (input.error_message !== undefined) {
    updates.push(`error_message = $${paramIndex++}`);
    values.push(input.error_message);
  }
  if (input.project_id !== undefined) {
    updates.push(`project_id = $${paramIndex++}`);
    values.push(input.project_id);
  }
  if (input.raw_transaction_data !== undefined) {
    updates.push(`raw_transaction_data = $${paramIndex++}`);
    values.push(JSON.stringify(input.raw_transaction_data));
  }
  if (input.gateway_response !== undefined) {
    updates.push(`gateway_response = $${paramIndex++}`);
    values.push(JSON.stringify(input.gateway_response));
  }

  if (updates.length === 0) {
    // No fields to update
    return getTransactionBySignature(input.signature);
  }

  values.push(input.signature);

  const query = `
    UPDATE transactions
    SET ${updates.join(', ')}
    WHERE signature = $${paramIndex}
    RETURNING *
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return null;
  }

  return mapRowToTransaction(result.rows[0]);
}

/**
 * Delete transaction by signature
 */
export async function deleteTransaction(signature: string): Promise<boolean> {
  const query = 'DELETE FROM transactions WHERE signature = $1';
  const result = await pool.query(query, [signature]);
  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * Get transactions with filtering and pagination
 */
export async function getTransactions(
  filter: TransactionFilter = {}
): Promise<PaginatedResponse<Transaction>> {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Build WHERE clause dynamically
  if (filter.status) {
    conditions.push(`status = $${paramIndex++}`);
    values.push(filter.status);
  }
  if (filter.delivery_method) {
    conditions.push(`delivery_method = $${paramIndex++}`);
    values.push(filter.delivery_method);
  }
  if (filter.signer_pubkey) {
    conditions.push(`signer_pubkey = $${paramIndex++}`);
    values.push(filter.signer_pubkey);
  }
  if (filter.project_id !== undefined) {
    conditions.push(`project_id = $${paramIndex++}`);
    values.push(filter.project_id);
  }
  if (filter.start_date) {
    conditions.push(`created_at >= $${paramIndex++}`);
    values.push(filter.start_date);
  }
  if (filter.end_date) {
    conditions.push(`created_at <= $${paramIndex++}`);
    values.push(filter.end_date);
  }
  if (filter.min_cost !== undefined) {
    conditions.push(`cost_lamports >= $${paramIndex++}`);
    values.push(filter.min_cost);
  }
  if (filter.max_cost !== undefined) {
    conditions.push(`cost_lamports <= $${paramIndex++}`);
    values.push(filter.max_cost);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM transactions ${whereClause}`;
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].total, 10);

  // Get paginated results
  const limit = filter.limit ?? 50;
  const offset = filter.offset ?? 0;

  const dataQuery = `
    SELECT * FROM transactions
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex}
  `;

  const dataResult = await pool.query(dataQuery, [...values, limit, offset]);

  const transactions = dataResult.rows.map(mapRowToTransaction);

  return {
    data: transactions,
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  };
}

/**
 * Get recent transactions (last N transactions)
 */
export async function getRecentTransactions(limit = 10): Promise<Transaction[]> {
  const query = `
    SELECT * FROM transactions
    ORDER BY created_at DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [limit]);
  return result.rows.map(mapRowToTransaction);
}

/**
 * Get transactions by status
 */
export async function getTransactionsByStatus(
  status: 'pending' | 'confirmed' | 'failed',
  limit = 50
): Promise<Transaction[]> {
  const query = `
    SELECT * FROM transactions
    WHERE status = $1
    ORDER BY created_at DESC
    LIMIT $2
  `;

  const result = await pool.query(query, [status, limit]);
  return result.rows.map(mapRowToTransaction);
}

/**
 * Get total transaction count
 */
export async function getTotalTransactionCount(): Promise<number> {
  const query = 'SELECT COUNT(*) as total FROM transactions';
  const result = await pool.query(query);
  return parseInt(result.rows[0].total, 10);
}

/**
 * Get transaction count by delivery method
 */
export async function getCountByDeliveryMethod(): Promise<{
  jito: number;
  rpc: number;
  sanctum_sender: number;
  unknown: number;
}> {
  const query = `
    SELECT
      delivery_method,
      COUNT(*) as count
    FROM transactions
    GROUP BY delivery_method
  `;

  const result = await pool.query(query);

  const counts = {
    jito: 0,
    rpc: 0,
    sanctum_sender: 0,
    unknown: 0,
  };

  result.rows.forEach((row) => {
    const method = row.delivery_method.replace('-', '_'); // sanctum-sender -> sanctum_sender
    if (method in counts) {
      counts[method as keyof typeof counts] = parseInt(row.count, 10);
    }
  });

  return counts;
}

/**
 * Helper: Map database row to Transaction interface
 */
function mapRowToTransaction(row: any): Transaction {
  return {
    id: row.id,
    signature: row.signature,
    status: row.status,
    delivery_method: row.delivery_method,
    cost_lamports: parseInt(row.cost_lamports, 10),
    tip_lamports: row.tip_lamports ? parseInt(row.tip_lamports, 10) : undefined,
    tip_refunded: row.tip_refunded ?? undefined,
    response_time_ms: row.response_time_ms ?? undefined,
    confirmation_time_ms: row.confirmation_time_ms ?? undefined,
    slot: row.slot ? parseInt(row.slot, 10) : undefined,
    block_time: row.block_time ? new Date(row.block_time) : undefined,
    blockhash: row.blockhash ?? undefined,
    last_valid_block_height: row.last_valid_block_height
      ? parseInt(row.last_valid_block_height, 10)
      : undefined,
    instruction_count: row.instruction_count,
    signer_pubkey: row.signer_pubkey,
    error_code: row.error_code ?? undefined,
    error_message: row.error_message ?? undefined,
    project_id: row.project_id ?? undefined,
    raw_transaction_data: row.raw_transaction_data ?? undefined,
    gateway_response: row.gateway_response ?? undefined,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };
}
