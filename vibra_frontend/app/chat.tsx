import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import config from '../config.json';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


// Define the type for the navigation stack
type RootStackParamList = {
    Chat: { chatId: number }; // Define the params expected by the Chat screen
  };
  
  // Define the type for the route and navigation props
  type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
  type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

interface ChatProps {
    route: ChatScreenRouteProp;
    navigation: ChatScreenNavigationProp;
}
  

// Define types for sender and message
interface Sender {
  username: string;
  profile_picture: string;
}

interface Message {
  id: number;
  sender: Sender;
  text: string;
  timestamp: string;
}

const Chat: React.FC<ChatProps> = ({ route }) => {
  const { chatId } = route.params; // Get the chat ID from route parameters
  const [messages, setMessages] = useState<Message[]>([]); // Define the state as an array of Message
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the messages for this specific chat
  const getMessages = async () => {
    const apiUrl = `http://${config.MY_IP}:8000/conversations/${chatId}/messages/`;
    try {
      const res = await axios.get(apiUrl);
      setMessages(res.data);  // Assuming the response contains the message data
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages', error);
      setLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    const apiUrl = `http://${config.MY_IP}:8000/conversations/${chatId}/messages/`;
    try {
      await axios.post(apiUrl, { text: newMessage }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setNewMessage('');
      getMessages();  // Refresh messages after sending
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  useEffect(() => {
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
          <View style={[styles.message, item.sender.username === 'me' ? styles.myMessage : styles.theirMessage]}>
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
        <Button title="Send" onPress={sendMessage} />
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
  myMessage: {
    backgroundColor: '#daf8e3',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
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
  }
});

export default Chat;
