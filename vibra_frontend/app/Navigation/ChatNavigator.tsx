import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatList from '../tabs/chatList';
import Chat from '../chat';

// Define the stack navigator
const Stack = createStackNavigator();

const ChatNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={ChatList} />   {/* Chat List screen */}
      <Stack.Screen name="Chat" component={Chat} />        {/* Individual chat screen */}
    </Stack.Navigator>
  );
};

export default ChatNavigator;
