import axios from 'axios';
import config from '../config.json';

export const fetchChats = async () => {
    const apiUrl = `http://${config.MY_IP}:8000/conversations/`;
    try {
        const response = await axios.get(apiUrl);
        console.log('Fetched chat data:', response.data);
        return response.data.map((chat: any) => ({
        id: chat.id,
        name: chat.group_name,
        }));
    } catch (error) {
        console.error('Error fetching chats:', error);
        return [];
    }
};

export const getRecommendations = async (trackId?: number) => {
    const apiUrl = `http://${config.MY_IP}:8000/for_you/recommended/`;
    try {
        const res = await axios[trackId ? 'post' : 'get'](apiUrl, trackId ? { track_id: trackId } : undefined, {
        headers: { 'Content-Type': 'application/json' },
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
};

export const loadInitialRecommendations = async () => {
    const apiUrl = `http://${config.MY_IP}:8000/for_you/recommended/`;
    try {
      const res = await axios.get(apiUrl, { headers: { 'Content-Type': 'application/json' } });
      return res.data;
    } catch (error) {
      console.error('Error sending GET request', error);
    }
};