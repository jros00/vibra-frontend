import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { fetchMessages, sendMessage } from '../services/MessageApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Message } from '@/types/Message';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';

// Define the param list for the stack navigator
type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: number };
};

// Define the types for the navigation and route props
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface ChatProps {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

const Chat: React.FC<ChatProps> = ({ route, navigation }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null); // For auto-scrolling

  // Fetch initial messages when the component mounts
  useEffect(() => {
    const getMessages = async () => {
      try {
        console.log('Fetching messages for chat ID:', chatId);
        const fetchedMessages = await fetchMessages(chatId);
        console.log('Fetched Messages:', fetchedMessages);
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
      console.log('New WebSocket message received:', newData);
  
      // Check if the data has a "message" key
      if (newData.message) {
        const newMessage = newData.message;
  
        setMessages((prevMessages) => {
          // Append the new message only if it doesn't already exist
          if (!prevMessages.find((msg) => msg.id === newMessage.id)) {
            const updatedMessages = [...prevMessages, newMessage];
            console.log('Updating messages with new data:', updatedMessages);
            return updatedMessages;
          }
          return prevMessages;
        });
  
        // Ensure that the flat list scrolls to the end when new data is received
        flatListRef.current?.scrollToEnd({ animated: true });
      } else {
        console.error('Unexpected WebSocket message format:', newData);
      }
    }, []),
  );


  // Handle sending a new message using the POST request
  const handleSend = useCallback(async () => {
    if (newMessage.trim()) {
      try {
        const sentMessage = await sendMessage(chatId, newMessage);
        // setMessages((prevMessages) => [...prevMessages, sentMessage]);
        setNewMessage('');
        flatListRef.current?.scrollToEnd({ animated: true }); // Auto-scroll after sending
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }, [chatId, newMessage]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <MessageList messages={messages} flatListRef={flatListRef} />
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
  message: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
});

export default Chat;
