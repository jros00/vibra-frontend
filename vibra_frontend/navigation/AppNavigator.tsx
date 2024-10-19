import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import SongDetail from '../screens/ChatSong';

const RootStack = createStackNavigator();
console.log('appnavigator loaded')

const AppNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="Login">
      <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <RootStack.Screen
        name="SongDetail"
        component={SongDetail}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

export default AppNavigator;
