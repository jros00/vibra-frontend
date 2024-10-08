import axios from 'axios';
import config from '../config.json';

export const fetchMessages = async (group_id: number) => {
  try {
    const response = await axios.get(`http://${config.MY_IP}:8000/conversations/${group_id}/messages/`);
    console.log('Raw API response:', response);
    console.log('Parsed messages:', response.data.messages);
    return response.data.messages;
  } catch (error) {
    console.error(`Failed to fetch messages for group id ${group_id}:`, error);
    throw error;
  }
};

export const sendMessage = async (group_id: number, message: string) => {
  console.log(`Preparing to send message to group id: ${group_id}`, message);
  try {
    const response = await axios.post(`http://${config.MY_IP}:8000/conversations/${group_id}/messages/`, { message });
    console.log('Message successfully sent. Response:', response);
    return response.data.message;
  } catch (error) {
    console.error(`Error while sending message to group id ${group_id}:`, error);
    throw error;
  }
};
