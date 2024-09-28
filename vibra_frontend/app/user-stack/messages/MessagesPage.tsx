import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { fetchMessages, sendMessage } from '../../../utils/messagesApi';  // Import the message API

export default function MessagesPage({ route }) {
  const { recipientId } = route.params;  // Assuming you're passing recipientId through navigation params
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    // Fetch messages when the component mounts
    fetchMessages(recipientId).then(setMessages);
  }, [recipientId]);

  const handleSend = () => {
    sendMessage(recipientId, messageInput).then((newMessage) => {
      setMessages([...messages, newMessage]);
      setMessageInput('');  // Clear the input field
    });
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
