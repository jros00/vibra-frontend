export async function fetchMessages(recipientId: number) {
    const response = await fetch(`http://your-backend-url/api/messages/${recipientId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.messages;  // Adjust this based on your API response structure
  }
  
  export async function sendMessage(recipientId: number, content: string) {
    const response = await fetch(`http://your-backend-url/api/messages/${recipientId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': 'your-csrf-token',  // Include CSRF token if needed
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    return data.newMessage;  // Adjust based on your API response structure
  }
  