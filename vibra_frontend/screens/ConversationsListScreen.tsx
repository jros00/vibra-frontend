import React, { useEffect, useState } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useTheme } from '@react-navigation/native';
import config from '../config.json';
import { Chat } from '@/types/Chat';
import ChatItem from '@/components/ConversationItem';
import { View } from '@/components/Themed';

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

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
    return <Text style={[styles.text, { color: colors.text }]}>Loading...</Text>;
  }

  if (!chats.length) {
    return <Text style={[styles.text, { color: colors.text }]}>No chats available</Text>;
  }

  return (
    <View>
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ChatItem chat={item} />}
      contentContainerStyle={{ backgroundColor: colors.background }}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    padding: 10,
  },
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
