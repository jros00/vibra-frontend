import axios from 'axios';
import config from '../config.json';


export const fetchMessages = async (recipientId: number) => {
  console.log(`Fetching messages for recipientId: ${recipientId}`);
  try {
    const response = await axios.get(`http://${config.MY_IP}:8000/messages/${recipientId}/`);
    console.log(`Messages fetched successfully: `, response.data.messages);
    return response.data.messages;
  } catch (error) {
    console.error(`Failed to fetch messages for recipientId ${recipientId}:`, error);
    throw error;  // Re-throw the error after logging it
  }
};

export const sendMessage = async (recipientId: number, content: string) => {
  console.log(`Sending message to recipientId: ${recipientId} with content: ${content}`);
  try {
    const response = await axios.post(`http://${config.MY_IP}:8000/messages/${recipientId}/`, { content });
    console.log(`Message sent successfully: `, response.data.message);
    return response.data.message;
  } catch (error) {
    console.error(`Failed to send message to recipientId ${recipientId}:`, error);
    throw error;  // Re-throw the error after logging it
  }
};


// Fetch unread notifications
export const fetchNotifications = async () => {
  const response = await axios.get(`http://${config.MY_IP}:8000/notifications/`);
  return response.data;
};
