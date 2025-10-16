-- Migration 001: Create transactions table
-- Created: October 12, 2025
-- Description: Initial schema for Gateway transaction tracking

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,

  -- Transaction Identifiers
  signature VARCHAR(88) NOT NULL UNIQUE,  -- Solana transaction signature (base58)

  -- Transaction Details
  status VARCHAR(20) NOT NULL,  -- 'pending', 'confirmed', 'failed'
  delivery_method VARCHAR(30) NOT NULL,  -- 'sanctum-sender', 'jito', 'rpc'

  -- Cost & Performance Metrics
  cost_lamports BIGINT NOT NULL DEFAULT 0,  -- Total cost in lamports
  tip_lamports BIGINT DEFAULT 0,  -- Jito tip amount (if applicable)
  tip_refunded BOOLEAN DEFAULT FALSE,  -- Whether Jito tip was refunded
  response_time_ms INTEGER,  -- Time from buildGatewayTransaction to sendTransaction response
  confirmation_time_ms INTEGER,  -- Time to confirmation on-chain

  -- Blockchain Data
  slot BIGINT,  -- Slot number when confirmed
  block_time TIMESTAMP,  -- Block timestamp
  blockhash VARCHAR(44),  -- Recent blockhash used
  last_valid_block_height BIGINT,  -- Last valid block height

  -- Transaction Content
  instruction_count INTEGER NOT NULL,  -- Number of instructions (should be 5+ with Gateway)
  signer_pubkey VARCHAR(44) NOT NULL,  -- Fee payer public key

  -- Error Tracking (for failed transactions)
  error_code VARCHAR(50),  -- Error code from Gateway/Solana
  error_message TEXT,  -- Full error message

  -- Metadata
  project_id BIGINT,  -- Future: multi-project support (FK to projects table)
  raw_transaction_data JSONB,  -- Full transaction data for debugging
  gateway_response JSONB,  -- Full Gateway API response

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'failed')),
  CONSTRAINT valid_delivery_method CHECK (delivery_method IN ('sanctum-sender', 'jito', 'rpc', 'unknown'))
);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_transactions_signature ON transactions(signature);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_delivery_method ON transactions(delivery_method);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_signer ON transactions(signer_pubkey);

-- Composite indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_transactions_status_delivery ON transactions(status, delivery_method);
CREATE INDEX IF NOT EXISTS idx_transactions_created_delivery ON transactions(created_at DESC, delivery_method);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE transactions IS 'Stores all Gateway transaction metadata for analytics';
COMMENT ON COLUMN transactions.signature IS 'Unique Solana transaction signature (base58 encoded)';
COMMENT ON COLUMN transactions.delivery_method IS 'How Gateway delivered the transaction: sanctum-sender, jito, or rpc';
COMMENT ON COLUMN transactions.tip_refunded IS 'Whether Jito dual-path submission resulted in tip refund';
COMMENT ON COLUMN transactions.gateway_response IS 'Full JSON response from Gateway API for debugging';

-- Verify table created
SELECT 'Migration 001 completed: transactions table created' AS status;
