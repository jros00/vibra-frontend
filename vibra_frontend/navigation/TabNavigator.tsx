import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ForYouScreen from '../screens/ForYouScreen';
import ChatNavigator from './ChatNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { GradientView } from '../components/GradientView';

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
          tabBarActiveTintColor: '#514C92',
          tabBarInactiveTintColor: '#9C96E3',
          tabBarStyle: {
            backgroundColor: 'transparent',  
            //position: 'absolute',            
            borderTopWidth: 0,               
          },
          headerShown: false,
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="For You" component={ForYouScreen} />
      <Tab.Screen name="Friends" component={ChatNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
