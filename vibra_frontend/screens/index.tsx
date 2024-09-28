<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
import { StyleSheet } from 'react-native';

=======
import React, { useState } from 'react';
import { Button, StyleSheet, Alert } from 'react-native';
>>>>>>> 9606ef4 (Added user login):vibra_frontend/app/(tabs)/index.tsx
import { Text, View } from '@/components/Themed';
import axios from 'axios';  // To make API requests
import { useNavigation } from '@react-navigation/native';  // For navigation

<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';

import config from '../config.json'
import Colors from '@/constants/Colors';
=======
const predefinedUsers = [
  { id: 1, name: 'Emilia' },
  { id: 2, name: 'Johannes' },
  { id: 3, name: 'Oscar' },
  { id: 4, name: 'Laura' },
  { id: 5, name: 'Hugo' },
];
>>>>>>> 9606ef4 (Added user login):vibra_frontend/app/(tabs)/index.tsx

export default function TabOneScreen() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `http://${config.MY_IP}:8000/home/welcome/`;
    console.log(URL);
    axios
      .get(apiUrl)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setMessage('Error fetching message');
      })
      .finally(() => {
        setLoading(false);
=======
  // Function to simulate login as a selected user
  const handleLogin = async (userName: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/for_you/', {
        username: userName,
>>>>>>> 9606ef4 (Added user login):vibra_frontend/app/(tabs)/index.tsx
      });
      
      // Handle the response (assume a successful login)
      if (response.status === 200) {
        setCurrentUser(userName);
        Alert.alert('Success', `Logged in as ${userName}`);
        
        // Navigate to user list page instead of directly to MessagesPage
        navigation.navigate('user_list_screen');
      } else {
        Alert.alert('Login failed', 'Something went wrong');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a User to Login</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
      <Text style={styles.sampleText}>This is a test to see if backend communication works. If it says "Welcome to Vibra!" above this message, this means connection with backend is working.</Text>
=======
      
      {currentUser ? (
        <Text style={styles.welcomeText}>Logged in as {currentUser}</Text>
      ) : (
        <View>
          {predefinedUsers.map((user) => (
            <Button 
              key={user.id} 
              title={`Login as ${user.name}`} 
              onPress={() => handleLogin(user.name)}  // Call login function on press
              disabled={loading}  // Disable button while loading
            />
          ))}
        </View>
      )}
>>>>>>> 9606ef4 (Added user login):vibra_frontend/app/(tabs)/index.tsx
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
  sampleText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.textColorLight,
=======
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
>>>>>>> 9606ef4 (Added user login):vibra_frontend/app/(tabs)/index.tsx
  },
});
