#!/usr/bin/env ts-node

import { healthCheck, pool, redisClient, closeDatabaseConnections } from './config.js';

/**
 * Test database connections
 * Verifies PostgreSQL and Redis connectivity
 */
async function testConnections(): Promise<void> {
  console.log('🧪 Testing Database Connections...\n');
  console.log('='.repeat(60));

  try {
    // Run health check
    const health = await healthCheck();

    console.log('\n📊 Health Check Results:\n');
    console.log(`PostgreSQL: ${health.postgres ? '✅ Connected' : '❌ Failed'}`);
    console.log(`Redis:      ${health.redis ? '✅ Connected' : '❌ Failed'}`);
    console.log(`Overall:    ${health.overall ? '✅ Healthy' : '❌ Unhealthy'}`);

    if (health.overall) {
      console.log('\n🎉 All database connections successful!');

      // Test PostgreSQL query
      console.log('\n📝 Testing PostgreSQL query...');
      const result = await pool.query('SELECT version() as version');
      console.log(`   PostgreSQL version: ${result.rows[0].version.split(',')[0]}`);

      // Test Redis operations
      console.log('\n📝 Testing Redis operations...');
      await redisClient.set('test:key', 'Hello Gateway Insights!');
      const value = await redisClient.get('test:key');
      console.log(`   Redis GET test: ${value}`);
      await redisClient.del('test:key');
      console.log('   Redis DEL test: ✅');

      console.log('\n✅ All tests passed!');
    } else {
      console.error('\n❌ Database connection failed!');
      console.error('\nTroubleshooting:');
      console.error('1. Check .env file has correct DATABASE_URL and REDIS_URL');
      console.error('2. Verify Railway services are running');
      console.error('3. Check network connectivity');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    process.exit(1);
  } finally {
    await closeDatabaseConnections();
    console.log('\n='.repeat(60));
  }
}

// Run tests
testConnections();
