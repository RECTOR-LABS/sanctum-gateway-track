'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

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

export interface WSMessage {
  type: WSEventType;
  data: any;
  timestamp: string;
}

export interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WSMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const {
    url,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnect = useRef(true);

  const connect = useCallback(() => {
    // Prevent multiple simultaneous connections
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setIsConnected(true);
        setReconnectCount(0);
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      ws.onclose = () => {
        console.log('[WebSocket] Disconnected');
        setIsConnected(false);
        wsRef.current = null;
        onDisconnect?.();

        // Attempt reconnection with exponential backoff
        if (shouldReconnect.current) {
          setReconnectCount((prevCount) => {
            const nextCount = prevCount + 1;

            if (nextCount <= maxReconnectAttempts) {
              // Exponential backoff: 3s, 6s, 12s, etc. (capped at 30s)
              const backoffDelay = Math.min(reconnectInterval * Math.pow(2, prevCount), 30000);
              console.log(`[WebSocket] Reconnecting in ${backoffDelay}ms... (attempt ${nextCount}/${maxReconnectAttempts})`);

              reconnectTimeoutRef.current = setTimeout(() => {
                connect();
              }, backoffDelay);
            } else {
              console.error('[WebSocket] Max reconnection attempts reached');
            }

            return nextCount;
          });
        }
      };

      ws.onerror = (error) => {
        // WebSocket errors often have minimal info, log connection state instead
        console.error('[WebSocket] Connection error - Ready State:', ws.readyState, 'URL:', url);
        onError?.(error);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
    }
  }, [url, onConnect, onMessage, onDisconnect, onError, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    shouldReconnect.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const send = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send message, connection not open');
    }
  }, []);

  useEffect(() => {
    shouldReconnect.current = true;
    connect();

    return () => {
      shouldReconnect.current = false;
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]); // Only reconnect when URL changes

  return {
    isConnected,
    reconnectCount,
    send,
    disconnect,
  };
}
