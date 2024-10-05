import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ForYouScreen from '../screens/ForYouScreen';
import ChatNavigator from './ChatNavigator';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        let iconName: 'home' | 'star' | 'people' = 'home';

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'For You') {
          iconName = 'star';
        } else if (route.name === 'Friends') {
          iconName = 'people';
        }

        return {
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="For You" component={ForYouScreen} />
      <Tab.Screen name="Friends" component={ChatNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
