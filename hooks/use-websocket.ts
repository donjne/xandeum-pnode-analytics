import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/stores/appStore';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnecting' | 'disconnected' | 'error';

export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp: number;
}

export interface UseWebSocketOptions {
  url: string;
  enabled?: boolean;
  protocols?: string | string[];
  
  // Reconnection options
  reconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  reconnectDecay?: number;
  maxReconnectInterval?: number;
  
  // Heartbeat options
  heartbeatInterval?: number;
  heartbeatMessage?: string | object;
  
  // Event handlers
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (event: Event) => void;
  onReconnect?: (attempt: number) => void;
  
  // Message filter
  filter?: (message: WebSocketMessage) => boolean;
}

export interface UseWebSocketReturn {
  status: WebSocketStatus;
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  send: (data: string | object) => void;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  reconnectAttempt: number;
}

/**
 * Production-ready WebSocket hook with:
 * - Automatic reconnection with exponential backoff
 * - Heartbeat/ping-pong mechanism
 * - Message queuing when disconnected
 * - Clean connection management
 * - TypeScript support
 */
export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    enabled = true,
    protocols,
    reconnect = true,
    reconnectAttempts = 10,
    reconnectInterval = 1000,
    reconnectDecay = 1.5,
    maxReconnectInterval = 30000,
    heartbeatInterval = 30000,
    heartbeatMessage = { type: 'ping' },
    onOpen,
    onClose,
    onMessage,
    onError,
    onReconnect,
    filter,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<(string | object)[]>([]);
  const attemptCountRef = useRef(0);
  const isManualCloseRef = useRef(false);

  const { setNetworkConnected } = useAppStore();

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Send heartbeat
  const sendHeartbeat = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof heartbeatMessage === 'string' 
        ? heartbeatMessage 
        : JSON.stringify(heartbeatMessage);
      wsRef.current.send(message);
    }
  }, [heartbeatMessage]);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    if (heartbeatInterval > 0) {
      heartbeatIntervalRef.current = setInterval(sendHeartbeat, heartbeatInterval);
    }
  }, [heartbeatInterval, sendHeartbeat]);

  // Process message queue
  const processQueue = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && messageQueueRef.current.length > 0) {
      const queue = [...messageQueueRef.current];
      messageQueueRef.current = [];
      
      queue.forEach((data) => {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        wsRef.current?.send(message);
      });
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || 
        wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    isManualCloseRef.current = false;
    setStatus('connecting');

    try {
      wsRef.current = new WebSocket(url, protocols);

      wsRef.current.onopen = (event) => {
        setStatus('connected');
        setNetworkConnected(true);
        attemptCountRef.current = 0;
        setReconnectAttempt(0);
        
        startHeartbeat();
        processQueue();
        
        onOpen?.(event);
      };

      wsRef.current.onclose = (event) => {
        setStatus('disconnected');
        setNetworkConnected(false);
        clearTimers();

        onClose?.(event);

        // Auto-reconnect if not manually closed
        if (!isManualCloseRef.current && reconnect && attemptCountRef.current < reconnectAttempts) {
          const delay = Math.min(
            reconnectInterval * Math.pow(reconnectDecay, attemptCountRef.current),
            maxReconnectInterval
          );

          attemptCountRef.current += 1;
          setReconnectAttempt(attemptCountRef.current);

          reconnectTimeoutRef.current = setTimeout(() => {
            onReconnect?.(attemptCountRef.current);
            connect();
          }, delay);
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          const message: WebSocketMessage = {
            type: parsedData.type || 'message',
            data: parsedData.data || parsedData,
            timestamp: Date.now(),
          };

          // Apply filter if provided
          if (!filter || filter(message)) {
            setLastMessage(message);
            onMessage?.(message);
          }
        } catch (error) {
          // Handle plain text messages
          const message: WebSocketMessage = {
            type: 'text',
            data: event.data,
            timestamp: Date.now(),
          };
          
          if (!filter || filter(message)) {
            setLastMessage(message);
            onMessage?.(message);
          }
        }
      };

      wsRef.current.onerror = (event) => {
        setStatus('error');
        setNetworkConnected(false);
        onError?.(event);
      };

    } catch (error) {
      setStatus('error');
      console.error('WebSocket connection error:', error);
    }
  }, [url, protocols, reconnect, reconnectAttempts, reconnectInterval, reconnectDecay, maxReconnectInterval, onOpen, onClose, onMessage, onError, onReconnect, filter, setNetworkConnected, startHeartbeat, processQueue, clearTimers]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    isManualCloseRef.current = true;
    clearTimers();
    attemptCountRef.current = 0;
    setReconnectAttempt(0);

    if (wsRef.current) {
      setStatus('disconnecting');
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
  }, [clearTimers]);

  // Force reconnect
  const reconnectNow = useCallback(() => {
    disconnect();
    setTimeout(() => {
      attemptCountRef.current = 0;
      setReconnectAttempt(0);
      connect();
    }, 100);
  }, [disconnect, connect]);

  // Send message
  const send = useCallback((data: string | object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      wsRef.current.send(message);
    } else {
      // Queue message if not connected
      messageQueueRef.current.push(data);
    }
  }, []);

  // Connect/disconnect based on enabled prop
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    status,
    isConnected: status === 'connected',
    lastMessage,
    send,
    connect,
    disconnect,
    reconnect: reconnectNow,
    reconnectAttempt,
  };
}

/**
 * Hook for WebSocket with automatic pNode updates
 * Subscribes to real-time pNode status updates
 */
export function usePNodeWebSocket(enabled: boolean = true) {
  const { setNetworkConnected } = useAppStore();
  
  // Get WebSocket URL from environment or fallback
  const wsUrl = typeof window !== 'undefined' 
    ? `ws://${window.location.hostname}:6001/ws` // WebSocket port for pNode updates
    : '';

  return useWebSocket({
    url: wsUrl,
    enabled: enabled && !!wsUrl,
    reconnect: true,
    reconnectAttempts: 5,
    heartbeatInterval: 30000,
    onOpen: () => {
      console.log('WebSocket connected to pNode updates');
      setNetworkConnected(true);
    },
    onClose: () => {
      console.log('WebSocket disconnected from pNode updates');
    },
    onError: (event) => {
      console.error('WebSocket error:', event);
      setNetworkConnected(false);
    },
    onMessage: (message) => {
      // Handle different message types
      if (message.type === 'pnode_update') {
        // Update will be handled by React Query cache
        console.log('Received pNode update:', message.data);
      }
    },
  });
}