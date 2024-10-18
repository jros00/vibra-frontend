import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'; // Ensure this path is correct
import ForYouScreen from '../screens/ForYouScreen'; // Ensure this path is correct
import ChatNavigator from './ChatNavigator'; // Ensure this path is correct
import ProfileScreen from '../screens/ProfileScreen'; // Ensure this path is correct
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        let iconName: 'home' | 'star' | 'people' | 'person' = 'home';

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'For You') {
          iconName = 'star';
        } else if (route.name === 'Friends') {
          iconName = 'people';
        } else if (route.name === 'Profile') {
          iconName = 'person';
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
      <Tab.Screen name="Profile" component={ProfileScreen} /> {/* Ensure this path is correct */}
    </Tab.Navigator>
  );
};

export default TabNavigator;
