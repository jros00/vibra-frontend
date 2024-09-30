<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
import { StyleSheet } from 'react-native';

=======
import React, { useState } from 'react';
import { Button, StyleSheet, Alert } from 'react-native';
>>>>>>> 9606ef4 (Added user login):vibra_frontend/app/(tabs)/index.tsx
=======
import { StyleSheet, ActivityIndicator } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
>>>>>>> c7bae5d (Code for login, messages and notifications):vibra_frontend/app/(tabs)/index.tsx
import { Text, View } from '@/components/Themed';
import { HelloWave } from '@/components/HelloWave';
import axios from 'axios';
import { useEffect, useState } from 'react';
import config from '../../config.json';

<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';

import config from '../../config.json'
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
  const navigation = useNavigation();  // Use navigation hook

<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `http://${config.MY_IP}:8000/home/welcome/`;
    console.log(URL);
=======
export default function HomeScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `http://${config.MY_IP}:8000/home/welcome/`;
    console.log(apiUrl);
    
>>>>>>> c7bae5d (Code for login, messages and notifications):vibra_frontend/app/(tabs)/index.tsx
    axios
      .get(apiUrl)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
        console.error(error);
=======
        console.error('Error fetching message:', error);
>>>>>>> c7bae5d (Code for login, messages and notifications):vibra_frontend/app/(tabs)/index.tsx
        setMessage('Error fetching message');
      })
      .finally(() => {
        setLoading(false);
<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
=======
  // Function to simulate login as a selected user
=======
>>>>>>> 0f84e89 (Added user login):vibra_frontend/app/(tabs)/index.tsx
  const handleLogin = async (userName: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/home/', {
        username: userName,
>>>>>>> 9606ef4 (Added user login):vibra_frontend/app/(tabs)/index.tsx
=======
>>>>>>> c7bae5d (Code for login, messages and notifications):vibra_frontend/app/(tabs)/index.tsx
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {message}
        <HelloWave />
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
<<<<<<< HEAD:vibra_frontend/app/tabs/index.tsx
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
=======
      <EditScreenInfo path="app/(tabs)/index.tsx" />
>>>>>>> c7bae5d (Code for login, messages and notifications):vibra_frontend/app/(tabs)/index.tsx
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
=======
>>>>>>> c7bae5d (Code for login, messages and notifications):vibra_frontend/app/(tabs)/index.tsx
});
