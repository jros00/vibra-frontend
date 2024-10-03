import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import config from '../../config.json';

interface Participant {
  username: string;
  profile_picture: string;
}

interface Chat {
  id: number;
  participants: Participant[];
  last_message: string;
  last_message_timestamp: string;
}

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();  // React Navigation's useNavigation

  const getChats = async () => {
    const apiUrl = `http://${config.MY_IP}:8000/conversations/`;
    try {
      const res = await axios.get(apiUrl);
      setChats(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat data', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!chats.length) {
    return <Text>No chats available</Text>;
  }

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: item.id })}>
          <View style={styles.chatItem}>
            <Image source={{ uri: 'https://example.com/default-profile.png' }} style={styles.profilePicture} />
            <View>
              <Text style={styles.name}>Chat with {item.participants.map(p => p.username).join(', ')}</Text>
              <Text style={styles.lastMessage}>{item.last_message}</Text>
            </View>
            <Text style={styles.timestamp}>{new Date(item.last_message_timestamp).toLocaleTimeString()}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#666',
  },
  timestamp: {
    marginLeft: 'auto',
    color: '#666',
  },
});

export default ChatList;
