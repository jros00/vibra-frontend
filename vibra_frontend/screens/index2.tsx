import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import axios, { AxiosError } from 'axios';
import config from '../config.json';

interface LoginResponse {
  message: string;
  token?: string;
}

const predefinedUsers = [
  { id: 1, name: 'Emilia' },
  { id: 2, name: 'Johannes' },
  { id: 3, name: 'Oscar' },
  { id: 4, name: 'Laura' },
  { id: 5, name: 'Hugo' },
];

export default function LoginScreen() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (userName: string) => {
    setLoading(true);
    try {
      // Make the login request with the CSRF token in the headers
      const response = await axios.post<LoginResponse>(
        `http://${config.MY_IP}:8000/login/`,
        { username: userName },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken ?? '',  // Include the CSRF token in the headers
          },
          withCredentials: true,  // Ensure cookies are sent with the request
        }
      );

      if (response.status === 200) {
        const { message } = response.data;
        setCurrentUser(userName);
        Alert.alert('Success', `Logged in as ${userName}: ${message}`);
        router.push('/(tabs)');
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          Alert.alert('Unauthorized', 'Invalid credentials, please try again.');
        } else if (status === 500) {
          Alert.alert('Server Error', 'There was a problem on the server. Please try again later.');
        } else {
          const data = err.response.data as any;
          Alert.alert('Error', data?.message || 'Unable to log in');
        }
      } else if (err.request) {
        Alert.alert('Network Error', 'Unable to reach the server. Please check your network connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a User to Login</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        predefinedUsers.map((user) => (
          <Button
            key={user.id}
            title={loading ? 'Logging in...' : `Login as ${user.name}`}
            onPress={() => handleLogin(user.name)}
            disabled={loading}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
});
