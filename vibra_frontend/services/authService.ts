import axios, { AxiosError } from 'axios';
import config from '../config.json';
import { Alert } from 'react-native';

interface LoginResponse {
  message: string;
  token?: string;
}

export const loginUser = async (
  userName: string,
  csrfToken: string | null
): Promise<LoginResponse | null> => {
  try {
    const response = await axios.post<LoginResponse>(
      `http://${config.MY_IP}:8000/login/`,
      { username: userName },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken ?? '',
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      Alert.alert('Success', `Logged in as ${userName}: ${response.data.message}`);
      return response.data;
    }
    return null;
  } catch (error) {
    const err = error as AxiosError<LoginResponse>;
    if (err.response) {
      const status = err.response.status;
      const data = err.response.data as LoginResponse;
      if (status === 401) {
        Alert.alert('Unauthorized', 'Invalid credentials, please try again.');
      } else if (status === 500) {
        Alert.alert('Server Error', 'There was a problem on the server. Please try again later.');
      } else {
        Alert.alert('Error', data?.message || 'Unable to log in');
      }
    } else if (err.request) {
      Alert.alert('Network Error', 'Unable to reach the server. Please check your network connection.');
    } else {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
    return null;
  }
};
