import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatList from '../screens/ConversationsListScreen';
import Chat from '../screens/ChatScreen';
import { GradientView } from '../components/GradientView';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: number; chatName: string };
};

// Define the stack navigator
const Stack = createStackNavigator<RootStackParamList>();

const ChatNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackground: () => (
          <GradientView style={{ flex: 1 }} />
        ),
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="ChatList" component={ChatList} options={{ headerTitle: 'Conversations', headerLeft: () => null }} />
      <Stack.Screen 
        name="Chat" 
        component={Chat} 
        options={({ route }: { route: RouteProp<RootStackParamList, 'Chat'> }) => ({
          headerTitle: route.params.chatName,  // Set header title dynamically based on chatName
        })}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
