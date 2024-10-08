import config from '../config.json';

export function createWebSocket(
  endpoint: string, 
  onMessageCallback: (event: MessageEvent) => void, 
  token?: string
) {
  let ws: WebSocket | null = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  let pingInterval: any = null;
  let reconnectTimer: any = null;

  // Function to establish WebSocket connection
  const connect = () => {
    // Avoid duplicate connection attempts
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket already connected or connecting. Skipping new connection.');
      return;
    }

    const url = token
      ? `ws://${config.MY_IP}:8000/ws/${endpoint}/?token=${token}`
      : `ws://${config.MY_IP}:8000/ws/${endpoint}/`;

    console.log(`Attempting to connect to WebSocket at ${url}`);

    ws = new WebSocket(url);

    // WebSocket connection opened
    ws.onopen = () => {
      console.log(`WebSocket connection to ${endpoint} opened.`);
      reconnectAttempts = 0;

      // Start sending pings to keep the connection alive
      startPing();
    };

    // WebSocket message received
    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      try {
        const parsedData = JSON.parse(event.data);
        console.log('Parsed WebSocket message:', parsedData);
        onMessageCallback(parsedData);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // WebSocket connection closed
    ws.onclose = () => {
      console.warn('WebSocket connection closed.');
      stopPing();
      attemptReconnect();  // Try to reconnect if the connection closes unexpectedly
    };

    // WebSocket error encountered
    ws.onerror = (error) => {
      console.error('WebSocket error encountered:', error);
    };
  };

  // Function to attempt reconnection with exponential backoff
  const attemptReconnect = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      const reconnectDelay = Math.min(1000 * 2 ** reconnectAttempts, 30000);  // Exponential backoff
      reconnectAttempts++;
      console.log(`Reconnecting in ${reconnectDelay / 1000} seconds (Attempt ${reconnectAttempts}/${maxReconnectAttempts})`);

      reconnectTimer = setTimeout(connect, reconnectDelay);
    } else {
      console.error('Max reconnect attempts reached. Could not reconnect to WebSocket.');
    }
  };

  // Start sending pings to keep WebSocket connection alive
  const startPing = () => {
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
        console.log('Sent ping to keep connection alive.');
      }
    }, 30000);  // Ping every 30 seconds
  };

  // Stop ping interval when WebSocket is closed
  const stopPing = () => {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
  };

  // Clean up when manually closing WebSocket
  const close = () => {
    console.log('Closing WebSocket connection manually.');
    stopPing();
    if (ws) ws.close();
    if (reconnectTimer) clearTimeout(reconnectTimer);
  };

  // Initial connection
  connect();

  return {
    close,
  };
}
