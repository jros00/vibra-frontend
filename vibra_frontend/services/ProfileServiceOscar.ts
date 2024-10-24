// ProfileService.ts
import axios from 'axios';
import { ProfileData } from '../types/ProfileDataOscar';
import config from '../config.json'

const API_URL = (`http://${config.MY_IP}:8000/profile`);

// Instead of userId, use username
export const fetchProfileData = async (username: string): Promise<ProfileData> => {
  const response = await axios.get(`${API_URL}/${username}/`);
  return response.data;
};

export const updateProfileField = async (username: string, field: keyof ProfileData, newValue: string) => {
  if (field === 'bio') {
    await axios.post(`${API_URL}/profile/edit/`, {
      username: username,
      bio: newValue,
    });
  } else {
    await axios.post(`${API_URL}/${username}/`, {
      [field]: newValue,
    });
  }
};