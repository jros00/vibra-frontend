import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatList from '../screens/ConversationsListScreen';
import Chat from '../screens/ChatScreen';

type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: number };
};

// Define the stack navigator
const Stack = createStackNavigator<RootStackParamList>();

const ChatNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatList} options={{ headerTitle: 'Chat List' }} />
      <Stack.Screen name="Chat" component={Chat} options={{ headerTitle: 'Chat' }} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
