import React, { useEffect, useState } from 'react';
import { Button, View, FlatList, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define the user type for TypeScript
type User = {
  id: number;
  username: string;
};

export default function FriendListScreen() {
  const navigation = useNavigation();
  const [friends, setFriends] = useState<User[]>([]);  // State to hold fetched users
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchUsers();
  }, []);

  const handleFriendPress = (friendId: number) => {
    navigation.navigate('MessagesPage', { recipientId: friendId});
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading friends...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.buttonContainer}>
            <Button
              title={`Message ${item.username}`}
              onPress={() => handleFriendPress(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

// Basic styles for layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
