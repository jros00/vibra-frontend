import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import config from '../../config.json'

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the chat list from the backend
  const getChats = async () => {
    const apiUrl = `http://${config.MY_IP}:8000/for_you/recommended/`; // Your backend API endpoint
    try {
      const res = await axios.get(apiUrl); // No need for authorization for now
      setChats(res.data); // Assuming the response contains the chat data
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat data', error);
      setLoading(false);
    }
  };

  // Fetch chats when the component is mounted
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
