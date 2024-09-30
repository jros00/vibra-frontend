import React, { useEffect, useState } from 'react';
import { Button, View, FlatList, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import config from '../../config.json';

type User = { id: number; username: string };

export default function UserListScreen() {
  const router = useRouter();
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch friends list on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://${config.MY_IP}:8000/users/`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await response.json();
        setFriends(data);
      } catch (error) {
        setError('Failed to load friends. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFriendPress = (friendId: number) => {
    // Navigate to the dynamic [recipientId] route
    router.push({
      pathname: `/messages/[recipientId]`,  // Reference the dynamic route path
      params: { recipientId: friendId },    // Pass recipientId as a parameter
    });
  };
  

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading friends...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Button title={`Message ${item.username}`} onPress={() => handleFriendPress(item.id)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
});
