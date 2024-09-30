import { useEffect, useRef } from 'react';
import { createWebSocket } from '@/utils/websocket';

export function useWebSocket(endpoint: string, onMessageCallback: (data: any) => void, token?: string) {
  const wsRef = useRef<ReturnType<typeof createWebSocket> | null>(null);  // Store the WebSocket instance

  useEffect(() => {
    if (wsRef.current) {
      console.log('Closing existing WebSocket connection before opening a new one.');
      wsRef.current.close();  // Close the existing WebSocket connection
    }

    // Create a new WebSocket connection with the token if provided
    wsRef.current = createWebSocket(endpoint, (event) => {
      const data = JSON.parse(event.data);
      onMessageCallback(data);
    }, token);

    // Cleanup function to close the WebSocket when the component unmounts
    return () => {
      if (wsRef.current) {
        console.log(`Closing WebSocket connection to ${endpoint}`);
        wsRef.current.close();
        wsRef.current = null;  // Set to null to avoid reusing old connections
      }
    };
  }, [endpoint, onMessageCallback, token]);  // Rerun if the endpoint, callback, or token changes
}
