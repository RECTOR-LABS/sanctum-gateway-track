import { Pool, PoolConfig } from 'pg';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

/**
 * PostgreSQL Connection Pool Configuration
 */
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Connection pool settings
  max: 20, // Maximum connections in pool
  min: 2, // Minimum connections to keep open
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 10000, // Timeout after 10s when acquiring connection
  // SSL configuration (Railway requires SSL)
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Required for Railway
  } : false,
};

/**
 * PostgreSQL Pool Instance
 * Use this for all database operations
 */
export const pool = new Pool(poolConfig);

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ PostgreSQL connected successfully!');
    console.log(`   Server time: ${result.rows[0].current_time}`);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    return false;
  }
}

/**
 * Redis Client Configuration
 */
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      // Reconnect after delay (exponential backoff)
      if (retries > 10) {
        console.error('❌ Redis: Max reconnection attempts reached');
        return new Error('Max reconnection attempts reached');
      }
      const delay = Math.min(retries * 100, 3000);
      console.log(`🔄 Redis: Reconnecting in ${delay}ms...`);
      return delay;
    },
  },
});

// Redis event handlers
redisClient.on('connect', () => {
  console.log('🔄 Redis: Connecting...');
});

redisClient.on('ready', () => {
  console.log('✅ Redis: Connected and ready!');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis: Reconnecting...');
});

/**
 * Initialize Redis connection
 */
export async function connectRedis(): Promise<boolean> {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    // Test connection
    await redisClient.ping();
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
}

/**
 * Close all database connections gracefully
 */
export async function closeDatabaseConnections(): Promise<void> {
  console.log('🔌 Closing database connections...');

  // Close PostgreSQL pool
  await pool.end();
  console.log('✅ PostgreSQL pool closed');

  // Close Redis
  if (redisClient.isOpen) {
    await redisClient.quit();
    console.log('✅ Redis connection closed');
  }
}

/**
 * Health check for all database services
 */
export async function healthCheck(): Promise<{
  postgres: boolean;
  redis: boolean;
  overall: boolean;
}> {
  const postgresHealthy = await testDatabaseConnection();
  const redisHealthy = await connectRedis();

  return {
    postgres: postgresHealthy,
    redis: redisHealthy,
    overall: postgresHealthy && redisHealthy,
  };
}

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  console.log('\n⚠️  SIGINT received, closing connections...');
  await closeDatabaseConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  SIGTERM received, closing connections...');
  await closeDatabaseConnections();
  process.exit(0);
});
