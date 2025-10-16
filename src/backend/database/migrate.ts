#!/usr/bin/env ts-node

import { pool } from './config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Migration Runner
 * Executes SQL migration files in order
 */

interface Migration {
  id: number;
  name: string;
  filepath: string;
}

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

/**
 * Create migrations tracking table
 */
async function createMigrationsTable(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  await pool.query(query);
  console.log('✅ Migrations tracking table ready');
}

/**
 * Get list of executed migrations
 */
async function getExecutedMigrations(): Promise<string[]> {
  const result = await pool.query(
    'SELECT migration_name FROM schema_migrations ORDER BY id'
  );
  return result.rows.map((row) => row.migration_name);
}

/**
 * Get pending migrations from filesystem
 */
function getPendingMigrations(executedMigrations: string[]): Migration[] {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.error(`❌ Migrations directory not found: ${MIGRATIONS_DIR}`);
    return [];
  }

  const files = fs.readdirSync(MIGRATIONS_DIR);
  const sqlFiles = files.filter((file) => file.endsWith('.sql'));

  const allMigrations: Migration[] = sqlFiles
    .map((file) => {
      const match = file.match(/^(\d+)_(.+)\.sql$/);
      if (!match) {
        console.warn(`⚠️  Skipping invalid migration filename: ${file}`);
        return null;
      }

      return {
        id: parseInt(match[1], 10),
        name: file,
        filepath: path.join(MIGRATIONS_DIR, file),
      };
    })
    .filter((m): m is Migration => m !== null)
    .sort((a, b) => a.id - b.id);

  // Filter out already executed migrations
  const pendingMigrations = allMigrations.filter(
    (m) => !executedMigrations.includes(m.name)
  );

  return pendingMigrations;
}

/**
 * Execute a single migration
 */
async function executeMigration(migration: Migration): Promise<boolean> {
  console.log(`\n📝 Executing migration: ${migration.name}`);

  try {
    // Read migration file
    const sql = fs.readFileSync(migration.filepath, 'utf-8');

    // Execute migration
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);

      // Record migration as executed
      await client.query(
        'INSERT INTO schema_migrations (migration_name) VALUES ($1)',
        [migration.name]
      );

      await client.query('COMMIT');
      console.log(`✅ Migration ${migration.name} completed successfully`);
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`❌ Migration ${migration.name} failed:`, error);
    return false;
  }
}

/**
 * Run all pending migrations
 */
async function runMigrations(): Promise<void> {
  console.log('🚀 Starting database migrations...\n');

  try {
    // Create migrations tracking table
    await createMigrationsTable();

    // Get executed migrations
    const executedMigrations = await getExecutedMigrations();
    console.log(`📊 Executed migrations: ${executedMigrations.length}`);

    // Get pending migrations
    const pendingMigrations = getPendingMigrations(executedMigrations);

    if (pendingMigrations.length === 0) {
      console.log('\n✅ No pending migrations. Database is up to date!');
      return;
    }

    console.log(`📋 Pending migrations: ${pendingMigrations.length}`);
    pendingMigrations.forEach((m) => console.log(`   - ${m.name}`));

    // Execute each migration
    let successCount = 0;
    for (const migration of pendingMigrations) {
      const success = await executeMigration(migration);
      if (success) {
        successCount++;
      } else {
        console.error('\n❌ Migration failed. Stopping.');
        process.exit(1);
      }
    }

    console.log(`\n✅ Migrations complete! (${successCount}/${pendingMigrations.length} successful)`);
  } catch (error) {
    console.error('\n❌ Migration process failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

/**
 * Show migration status
 */
async function showStatus(): Promise<void> {
  console.log('📊 Migration Status\n');

  try {
    await createMigrationsTable();

    const executedMigrations = await getExecutedMigrations();
    const pendingMigrations = getPendingMigrations(executedMigrations);

    console.log(`Executed migrations: ${executedMigrations.length}`);
    if (executedMigrations.length > 0) {
      executedMigrations.forEach((name) => console.log(`  ✅ ${name}`));
    }

    console.log(`\nPending migrations: ${pendingMigrations.length}`);
    if (pendingMigrations.length > 0) {
      pendingMigrations.forEach((m) => console.log(`  ⏳ ${m.name}`));
    }

    if (pendingMigrations.length === 0 && executedMigrations.length > 0) {
      console.log('\n✅ Database is up to date!');
    }
  } catch (error) {
    console.error('❌ Failed to check migration status:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// CLI handling
const command = process.argv[2];

if (command === 'status') {
  showStatus();
} else if (command === 'up' || !command) {
  runMigrations();
} else {
  console.log('Usage:');
  console.log('  npm run db:migrate       - Run pending migrations');
  console.log('  npm run db:migrate:status - Show migration status');
  process.exit(1);
}
