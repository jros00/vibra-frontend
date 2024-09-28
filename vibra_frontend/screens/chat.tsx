import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import config from '../config.json';
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
  text: string;
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

  useEffect(() => {
    const getMessages = async () => {
      const apiUrl = `http://${config.MY_IP}:8000/conversations/${chatId}/messages/`;
      try {
        const res = await axios.get(apiUrl);
        setMessages(res.data);  // Assuming the API response is an array of Message objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages', error);
        setLoading(false);
      }
    };

    getMessages();
  }, [chatId]);

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
            <Text>{item.text}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={() => {/* Send message logic */}} />
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
    borderRadius: 5,
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
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
});

export default Chat;
