import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import { View } from '@/components/Themed';
import { fetchMessages, sendMessage } from '../services/MessageApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Message } from '@/types/Message';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import { useUser } from '../hooks/useUser';

// Define the param list for the stack navigator
type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: number };
  SongDetail: { selectedMessage: Message; songMessages: Message[] };
};

// Define the types for the navigation and route props
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface ChatProps {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

const Chat: React.FC<ChatProps> = ({ route }) => {
  const { chatId } = route.params;
  const { profile } = useUser();
  const currentUserId = profile?.id || 0;

  // Use explicit typing for navigation
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList<Message>>(null);

  // Fetch initial messages when the component mounts
  useEffect(() => {
    const getMessages = async () => {
      try {
        const fetchedMessages = await fetchMessages(chatId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, [chatId]);

  // WebSocket connection to listen for new messages
  useWebSocket(
    `conversations/${chatId}`,
    useCallback((newData: any) => {
      if (newData.message) {
        const newMessage = newData.message;

        setMessages((prevMessages) => {
          if (!prevMessages.find((msg) => msg.id === newMessage.id)) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });

        flatListRef.current?.scrollToEnd({ animated: true });
      }
    }, []),
  );

  // Handle sending a new message using the POST request
  const handleSend = useCallback(async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(chatId, newMessage);
        setNewMessage('');
        flatListRef.current?.scrollToEnd({ animated: true });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }, [chatId, newMessage]);

  // Filter messages with track data for the SongDetail screen
  const songMessages = messages.filter((msg) => msg.track);

  // Handle song tap and navigate to SongDetail
  const handleSongPress = (message: Message) => {
    navigation.navigate('SongDetail', {
      selectedMessage: message,
      songMessages: messages.filter((m) => m.track),
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <MessageList
        messages={messages}
        flatListRef={flatListRef}
        onSongPress={handleSongPress}
        currentUserId={currentUserId}
      />
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default Chat;
