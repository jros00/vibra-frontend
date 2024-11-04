import { Alert } from 'react-native';
import axios from 'axios';
import config from '../config.json';
import { UserProfile } from '../types/UserProfile';

export const fetchUserProfile = async (userName: string): Promise<UserProfile | null> => {
  try {
    const response = await axios.get<UserProfile>(`http://${config.MY_IP}:8000/profile/${userName}/`);

    if (response.status === 200) {
      return {
        id: response.data.id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        biography: response.data.biography,
        username: response.data.username,
        profile_picture: response.data.profile_picture,
        liked_tracks: response.data.liked_tracks,
        followers: response.data.followers,
        following: response.data.following,
        taste_profile_color: response.data.taste_profile_color,
        taste_profile_title: response.data.taste_profile_title,
      };
    } else {
      Alert.alert('Error', 'Unable to fetch profile data');
      return null;
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to fetch profile data');
    console.error('Profile fetch error:', error);
    return null;
  }
};
