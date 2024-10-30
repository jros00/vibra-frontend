// src/components/ChatItem.tsx
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text } from './Themed';
import { Chat } from '@/types/Chat';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';

type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: number; chatName: string };
};

type ChatListNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

interface ConversationItemProps {
  chat: Chat;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ chat }) => {
  const navigation = useNavigation<ChatListNavigationProp>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: chat.id, chatName: chat.group_name })}>
      <View style={styles.chatItem}>
        <Image source={{ uri: chat.group_picture }} style={styles.profilePicture} />
        <View style={styles.chatInfo}>
          <Text style={styles.name}>{chat.group_name}</Text>
          <Text style={styles.members}>Chat with {chat.participants.map(p => p.username).join(', ')}</Text>
          <Text style={styles.lastMessage}>
            {chat.latest_message.content.length > 50
            ? `${chat.latest_message.content.slice(0, 50)}...`
            : chat.latest_message.content}
          </Text>
        </View>
        <Text style={styles.timestamp}>{new Date(chat.latest_message.timestamp).toLocaleTimeString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 5,
    borderBottomColor: '#ccc',
  },
  chatInfo: {
    flex: 1, 
    flexDirection: 'column',
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

export default ConversationItem;
