import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { fetchMessages, sendMessage } from '../utils/MessageApi';  // Import the message API
import { useWebSocket } from '@/hooks/useWebSocket';  // Import the WebSocket hook
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

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

// Define the Message type
interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: {
    username: string;
    profile_picture: string;
  };
}

const Chat: React.FC<ChatProps> = ({ route, navigation }) => {
  const { chatId } = route.params;  // Get the chat ID from route parameters
  const [messages, setMessages] = useState<Message[]>([]);  // Type messages as an array of Message
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch messages when the component mounts
  useEffect(() => {
    const getMessages = async () => {
      try {
        const fetchedMessages = await fetchMessages(chatId);  // Use the API utility to fetch messages
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
  useWebSocket(`conversations/${chatId}`, (newData: Message) => {
    // Handle incoming WebSocket messages by appending them to the messages list
    setMessages((prevMessages) => [...prevMessages, newData]);
  });

  // Handle sending a new message
  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        const sentMessage = await sendMessage(chatId, newMessage);  // Use the API utility to send message
        
        // Append the new message only if it doesn't already exist
        if (!messages.find((msg) => msg.id === sentMessage.id)) {
          setMessages([...messages, sentMessage]);
        }
        setNewMessage('');  // Clear input field
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.message}>
            {/* Display sender's username and the message */}
            <Text style={styles.sender}>{item.sender.username}:</Text>
            <Text>{item.content}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
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
