import axios from 'axios';
import config from '../config.json';


export const fetchMessages = async (group_id: number) => {
  try {
    const response = await axios.get(`http://${config.MY_IP}:8000/conversations/${group_id}/messages/`);
    console.log(`Messages fetched successfully: `, response.data.messages);
    return response.data.messages;
  } catch (error) {
    console.error(`Failed to fetch messages for group id ${group_id}:`, error);
    throw error;  // Re-throw the error after logging it
  }
};

export const sendMessage = async (group_id: number, text: string) => {
  console.log(`Sending message to group id: ${group_id} with content: ${text}`);
  try {
    const response = await axios.post(`http://${config.MY_IP}:8000/conversations/${group_id}/messages/`, { text });
    console.log(`Message sent successfully: `, response.data.message);
    return response.data.message;
  } catch (error) {
    console.error(`Failed to send message to group id ${group_id}:`, error);
    throw error;  // Re-throw the error after logging it
  }
};


// Fetch unread notifications
export const fetchNotifications = async () => {
  const response = await axios.get(`http://${config.MY_IP}:8000/notifications/`);
  return response.data;
};
