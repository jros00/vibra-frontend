import axios from 'axios';
import config from '../config.json';
import { ListeningTime } from '@/types/ListeningTime';

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

export const sendListeningTimes = async (listening_histories: Array<ListeningTime>) => {
    const apiUrl =`http://${config.MY_IP}:8000/action/listening_history/`;
    console.log('Sending listening histories:', JSON.stringify(listening_histories, null, 2));
    try {
        await axios.post(apiUrl, {'listening_histories': listening_histories} )
    } catch (error) {
        console.error('Error sending listening time data', error);
    }
};