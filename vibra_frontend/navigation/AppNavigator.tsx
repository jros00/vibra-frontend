import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import LoginScreen from '../screens/LoginScreen'; // Assuming LoginScreen is in screens folder
import TabNavigator from './TabNavigator';

// Create navigator
const RootStack = createStackNavigator();
console.log('appnavigator loaded')

const AppNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="Login">
      <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
    </RootStack.Navigator>
  );
};

export default AppNavigator;