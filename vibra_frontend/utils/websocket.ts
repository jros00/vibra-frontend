import config from '../config.json';
import { Alert } from 'react-native';

export function createWebSocket(endpoint: string, onMessageCallback: (event: MessageEvent) => void, token?: string) {
  let ws: WebSocket | null = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  let pingInterval: any;

  const connect = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected, skipping new connection attempt.');
      return;
    }

    const url = `ws://${config.MY_IP}:8000/ws/${endpoint}/?token=${token || ''}`;
    console.log(`Attempting to connect to WebSocket at ${url}`);
    
    // Open the WebSocket connection
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log(`WebSocket connection to ${endpoint} opened.`);
      reconnectAttempts = 0;

      // Keep the connection alive with pings
      pingInterval = setInterval(() => {
        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
          console.log('Sent ping to keep connection alive.');
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      console.log(`WebSocket message received: ${event.data}`);
      onMessageCallback(JSON.parse(event.data));
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error occurred: ${JSON.stringify(error)}`);
      Alert.alert('WebSocket Error', JSON.stringify(error));
    };

    ws.onclose = () => {
      console.log(`WebSocket connection to ${endpoint} closed.`);
      clearInterval(pingInterval);
      attemptReconnect();
    };
  };

  const attemptReconnect = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      const reconnectDelay = Math.min(1000 * 2 ** reconnectAttempts, 30000);  // Exponential backoff
      console.log(`Attempting to reconnect in ${reconnectDelay / 1000} seconds (Attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
      setTimeout(() => {
        reconnectAttempts++;
        connect();
      }, reconnectDelay);
    } else {
      console.error(`Max reconnect attempts (${maxReconnectAttempts}) reached. Could not reconnect to WebSocket.`);
      Alert.alert('Connection Error', 'Failed to reconnect to WebSocket.');
    }
  };

  connect();

  return {
    close: () => {
      if (ws) {
        clearInterval(pingInterval);
        ws.close();
      }
    }
  };
}
