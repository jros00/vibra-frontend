import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Import screens
import ChatList from './screens/chatList';
import ForYou from './screens/for_you';
import TabOneScreen from './screens/index'; // Import your index.tsx
import Chat from './app/chat';

type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: number };
};

// Create Tab Navigator and Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const App = () => {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <MainNavigator />
    </NavigationContainer>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Welcome">
      <Tab.Screen
        name="Welcome"
        component={TabOneScreen}  // Add the Welcome screen as the first tab
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
          title: 'Welcome',
        }}
      />
      <Tab.Screen
        name="ForYou"
        component={ForYou}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="music" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatStackNavigator}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="comments" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const ChatStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatList} options={{ headerTitle: 'Chat List' }} />
      <Stack.Screen name="Chat" component={Chat} options={{ headerTitle: 'Chat' }} />
    </Stack.Navigator>
  );
};

export default App;
