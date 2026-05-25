import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { getWebSocketService } from './services/websocket-service.js';
import { testDatabaseConnection, connectRedis } from './database/config.js';
import analyticsRouter from './api/analytics.js';
import monitorRouter from './api/monitor.js';
import demoRouter from './api/demoRoutes.js';

// Load environment variables
dotenv.config();

// Fail-fast environment validation
const requiredEnv = ['DATABASE_URL', 'REDIS_URL', 'GATEWAY_API_KEY', 'SOLANA_RPC_URL'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`[Startup] Missing required env vars: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Trust first proxy hop (nginx) so express-rate-limit uses real client IP, not 127.0.0.1
app.set('trust proxy', 1);

// Security headers. CSP disabled (we serve JSON, not HTML);
// CORP set to cross-origin so the FE on a different domain can read responses.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS: restrict to configured origin in production, allow all in dev
const corsOrigin = process.env.CORS_ORIGIN;
if (IS_PRODUCTION && !corsOrigin) {
  console.error('[Startup] CORS_ORIGIN must be set in production');
  process.exit(1);
}
app.use(
  cors({
    origin: corsOrigin ? corsOrigin.split(',').map((o) => o.trim()) : true,
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// Rate limiter on /api/* — 100 req/min per IP. Health check + WS upgrade are exempt.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', async (_req, res) => {
  const dbConnected = await testDatabaseConnection();

  res.json({
    status: dbConnected ? 'ok' : 'degraded',
    service: 'gateway-insights-backend',
    database: dbConnected ? 'connected' : 'disconnected',
    websocket: {
      enabled: true,
      clients: getWebSocketService().getClientCount(),
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount API routers
app.use('/api/analytics', analyticsRouter);
app.use('/api/monitor', monitorRouter);
app.use('/api/demo', demoRouter);

// API root endpoint
app.get('/api', (_req, res) => {
  res.json({
    message: 'Gateway Insights API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      analytics: '/api/analytics/*',
      monitor: '/api/monitor/*',
      demo: '/api/demo/*',
      websocket: 'ws://localhost:' + PORT,
    },
    analytics_endpoints: {
      overview: '/api/analytics/overview',
      transactions: '/api/analytics/transactions',
      costs: '/api/analytics/costs',
      success_rates: '/api/analytics/success-rates',
      trends: '/api/analytics/trends',
      delivery_methods: '/api/analytics/delivery-methods',
      errors: '/api/analytics/errors',
    },
    monitor_endpoints: {
      start_monitoring: 'POST /api/monitor/wallet',
      stop_monitoring: 'DELETE /api/monitor/wallet/:address',
      get_monitored_wallets: 'GET /api/monitor/wallets',
    },
    demo_endpoints: {
      start_demo: 'POST /api/demo/start',
      demo_status: 'GET /api/demo/status',
    },
  });
});

// Create HTTP server (needed for WebSocket)
const server = createServer(app);

// Initialize WebSocket service
const wsService = getWebSocketService();
wsService.initialize(server);

// Start server
server.listen(PORT, async () => {
  console.log('='.repeat(60));
  console.log('🚀 Gateway Insights Backend Server');
  console.log('='.repeat(60));
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ HTTP: http://localhost:${PORT}`);
  console.log(`✓ WebSocket: ws://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log('='.repeat(60));

  // Test database connection
  const dbConnected = await testDatabaseConnection();
  if (dbConnected) {
    console.log('✓ Database connection verified');
  } else {
    console.warn('⚠️  Database connection failed');
  }

  // Connect to Redis
  const redisConnected = await connectRedis();
  if (redisConnected) {
    console.log('✓ Redis connection verified');
  } else {
    console.warn('⚠️  Redis connection failed (caching disabled)');
  }

  console.log('='.repeat(60));
  console.log('Server ready to accept connections');
  console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n[Server] SIGTERM received, shutting down gracefully...');
  wsService.close();
  server.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n[Server] SIGINT received, shutting down gracefully...');
  wsService.close();
  server.close(() => {
    console.log('[Server] HTTP server closed');
    process.exit(0);
  });
});
