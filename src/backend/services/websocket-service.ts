import { WebSocket, WebSocketServer } from 'ws';
import { Server as HttpServer } from 'http';
import type { Transaction } from '../database/types/index.js';

/**
 * WebSocket Event Types
 */
export enum WSEventType {
  TRANSACTION_CREATED = 'transaction:created',
  TRANSACTION_UPDATED = 'transaction:updated',
  TRANSACTION_CONFIRMED = 'transaction:confirmed',
  TRANSACTION_FAILED = 'transaction:failed',
  ANALYTICS_UPDATE = 'analytics:update',
  CONNECTION = 'connection',
  PING = 'ping',
  PONG = 'pong',
}

/**
 * WebSocket Message Structure
 */
export interface WSMessage {
  type: WSEventType;
  data: any;
  timestamp: string;
}

/**
 * WebSocket Service
 * Handles real-time event streaming to connected clients
 */
export class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private pingInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize WebSocket server
   */
  initialize(server: HttpServer): void {
    this.wss = new WebSocketServer({ server });

    console.log('[WebSocketService] WebSocket server initialized');

    this.wss.on('connection', (ws: WebSocket) => {
      this.handleConnection(ws);
    });

    // Start ping interval to keep connections alive
    this.startPingInterval();
  }

  /**
   * Handle new client connection
   */
  private handleConnection(ws: WebSocket): void {
    this.clients.add(ws);
    console.log(`[WebSocketService] Client connected. Total clients: ${this.clients.size}`);

    // Send welcome message
    this.sendToClient(ws, {
      type: WSEventType.CONNECTION,
      data: {
        message: 'Connected to Gateway Insights WebSocket',
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });

    // Handle messages from client
    ws.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        this.handleClientMessage(ws, data);
      } catch (error) {
        console.error('[WebSocketService] Failed to parse client message:', error);
      }
    });

    // Handle client disconnect
    ws.on('close', () => {
      this.clients.delete(ws);
      console.log(`[WebSocketService] Client disconnected. Total clients: ${this.clients.size}`);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('[WebSocketService] WebSocket error:', error);
      this.clients.delete(ws);
    });
  }

  /**
   * Handle messages from client
   */
  private handleClientMessage(ws: WebSocket, message: any): void {
    switch (message.type) {
      case WSEventType.PING:
        this.sendToClient(ws, {
          type: WSEventType.PONG,
          data: { timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString(),
        });
        break;
      default:
        console.log('[WebSocketService] Unknown message type:', message.type);
    }
  }

  /**
   * Send message to specific client
   */
  private sendToClient(ws: WebSocket, message: WSMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(message: WSMessage): void {
    const messageStr = JSON.stringify(message);
    let sentCount = 0;

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
        sentCount++;
      }
    });

    console.log(`[WebSocketService] Broadcast ${message.type} to ${sentCount} clients`);
  }

  /**
   * Emit transaction created event
   */
  emitTransactionCreated(transaction: Transaction): void {
    this.broadcast({
      type: WSEventType.TRANSACTION_CREATED,
      data: {
        id: transaction.id,
        signature: transaction.signature,
        status: transaction.status,
        delivery_method: transaction.delivery_method,
        cost_lamports: transaction.cost_lamports,
        response_time_ms: transaction.response_time_ms,
        created_at: transaction.created_at,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emit transaction updated event
   */
  emitTransactionUpdated(transaction: Transaction): void {
    this.broadcast({
      type: WSEventType.TRANSACTION_UPDATED,
      data: {
        id: transaction.id,
        signature: transaction.signature,
        status: transaction.status,
        updated_at: transaction.updated_at,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emit transaction confirmed event
   */
  emitTransactionConfirmed(transaction: Transaction): void {
    this.broadcast({
      type: WSEventType.TRANSACTION_CONFIRMED,
      data: {
        id: transaction.id,
        signature: transaction.signature,
        slot: transaction.slot,
        block_time: transaction.block_time,
        confirmation_time_ms: transaction.confirmation_time_ms,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emit transaction failed event
   */
  emitTransactionFailed(transaction: Transaction): void {
    this.broadcast({
      type: WSEventType.TRANSACTION_FAILED,
      data: {
        id: transaction.id,
        signature: transaction.signature,
        error_code: transaction.error_code,
        error_message: transaction.error_message,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emit analytics update event
   */
  emitAnalyticsUpdate(analytics: any): void {
    this.broadcast({
      type: WSEventType.ANALYTICS_UPDATE,
      data: analytics,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Start ping interval to keep connections alive
   */
  private startPingInterval(): void {
    // Send ping every 30 seconds
    this.pingInterval = setInterval(() => {
      this.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          this.sendToClient(client, {
            type: WSEventType.PING,
            data: {},
            timestamp: new Date().toISOString(),
          });
        }
      });
    }, 30000);
  }

  /**
   * Get number of connected clients
   */
  getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Close WebSocket server
   */
  close(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.clients.forEach((client) => {
      client.close();
    });

    if (this.wss) {
      this.wss.close();
    }

    console.log('[WebSocketService] WebSocket server closed');
  }
}

/**
 * Singleton instance
 */
let wsServiceInstance: WebSocketService | null = null;

export function getWebSocketService(): WebSocketService {
  if (!wsServiceInstance) {
    wsServiceInstance = new WebSocketService();
  }
  return wsServiceInstance;
}
