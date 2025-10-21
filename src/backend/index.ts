import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { getWebSocketService } from './services/websocket-service.js';
import { testDatabaseConnection } from './database/config.js';
import analyticsRouter from './api/analytics.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
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

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Gateway Insights API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      analytics: '/api/analytics/*',
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
