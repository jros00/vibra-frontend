import { useEffect, useRef, useCallback } from 'react';
import { createWebSocket } from '@/services/websocket';

export function useWebSocket(endpoint: string, onMessageCallback: (data: any) => void, token?: string) {
  const wsRef = useRef<ReturnType<typeof createWebSocket> | null>(null);

  // Memoize the callback to ensure stability
  const stableOnMessageCallback = useCallback(onMessageCallback, [onMessageCallback]);

  useEffect(() => {
    // If there's already an active WebSocket, close it before opening a new one
    if (wsRef.current) {
      console.log('Closing existing WebSocket connection before opening a new one.');
      wsRef.current.close();
    }

    // Open a new WebSocket connection
    wsRef.current = createWebSocket(endpoint, stableOnMessageCallback, token);

    // Cleanup WebSocket connection on unmount or dependency change
    return () => {
      if (wsRef.current) {
        console.log(`Closing WebSocket connection to ${endpoint}`);
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [endpoint, stableOnMessageCallback, token]);
}
