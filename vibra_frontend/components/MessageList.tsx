import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useWebSocket } from '@/hooks/useWebSocket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config.json';

interface Message {
  sender: string;
  content: string;
}

export default function MessagesPage() {
  const { recipientId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Fetch the token asynchronously and then connect WebSocket
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      setToken(storedToken); // Set the token once it's fetched
    };

    fetchToken();
  }, []);

  // Use the custom hook for WebSocket connection once the token is available
  useEffect(() => {
    if (token && recipientId) {
      useWebSocket(`messages/${recipientId}`, (data) => {
        // Update messages on new WebSocket message
        setMessages((prevMessages) => [...prevMessages, { sender: data.sender, content: data.message }]);
      }, token);  // Now passing token as third argument
    }
  }, [token, recipientId]); // Re-run WebSocket connection when token is fetched or recipientId changes

  // Function to fetch messages via REST API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const response = await fetch(`http://${config.MY_IP}:8000/messages/${recipientId}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [recipientId]);

  // Function to send a message via REST API
  const handleSend = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://${config.MY_IP}:8000/messages/${recipientId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: messageInput })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Optimistically update the UI by appending the sent message to the list
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'You', content: messageInput }  // Assuming 'You' is the current user
      ]);

      setMessageInput('');  // Clear input field after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={{ padding: 10 }}>
      <ScrollView style={{ height: '80%' }}>
        {messages.map((msg, index) => (
          <Text key={index} style={{ marginVertical: 5 }}>
            {msg.sender}: {msg.content}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        value={messageInput}
        onChangeText={setMessageInput}
        placeholder="Type a message..."
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}
