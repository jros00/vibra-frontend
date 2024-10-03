import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Import screens
import ChatList from './app/(tabs)/chatList';
import ForYou from './app/(tabs)/for_you';
import Chat from './app/chat';

// Create Tab Navigator and Stack Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
    <Tab.Navigator>
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
