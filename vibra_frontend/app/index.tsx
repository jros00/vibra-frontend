import React, { useState } from 'react';
import { Button, StyleSheet, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import axios from 'axios';

const predefinedUsers = [
  { id: 1, name: 'Emilia' },
  { id: 2, name: 'Johannes' },
  { id: 3, name: 'Oscar' },
  { id: 4, name: 'Laura' },
  { id: 5, name: 'Hugo' },
];

export default function TabOneScreen() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();  // Use navigation hook

  const handleLogin = async (userName: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/home/', {
        username: userName,
      });
      
      if (response.status === 200) {
        setCurrentUser(userName);
        Alert.alert('Success', `Logged in as ${userName}`);
        
        // Navigate to user_list_screen
        navigation.navigate('(tabs)/index');
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
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
