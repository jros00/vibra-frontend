import React, { useEffect, useState } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import config from '../config.json';
import { Chat } from '@/types/Chat';
import ChatItem from '@/components/ConversationItem';


// Define the param list for the navigation stack
type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: number };
};

// Define the type for the navigation prop in ChatList
type ConversationsListNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<ConversationsListNavigationProp>();

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
      renderItem={({ item }) => <ChatItem chat={item} />}
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
  members: {
    fontSize: 12,
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
