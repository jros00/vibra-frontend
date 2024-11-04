import React, { useEffect, useState } from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useTheme } from '@react-navigation/native';
import config from '../config.json';
import { Chat } from '@/types/Chat';
import ChatItem from '@/components/ConversationItem';
import { View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

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
    <View style={styles.container}>
      
      {/* Header with Add Friends Button */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.addFriendButton, { borderColor: colors.text }]} onPress={() => console.log('Add Friend Pressed')}>
          <Text style={[styles.addFriendText, { color: colors.text }]}>Add friends</Text>
          <FontAwesome name="user-plus" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
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
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Aligns content to the right
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  addFriendText: {
    fontSize: 14,
    marginRight: 8,
  },
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
