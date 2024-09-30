import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.textColorLight,
        headerShown: useClientOnlyValue(false, true), // Prevent hydration errors on web
        tabBarActiveBackgroundColor: Colors.lightRed,
        tabBarInactiveBackgroundColor: Colors.lightRed,
        headerTintColor: Colors.textColorLight
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerStyle: {
            backgroundColor: Colors.lightRed,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,  // Updated icon
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors.textColorLight}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="for_you"
        options={{
          title: 'For You',
          headerStyle: {
            backgroundColor: Colors.lightRed,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,  // Updated icon
        }}
      />
      <Tabs.Screen
        name="user_list_screen"
        options={{
          title: 'Friends',
          headerStyle: {
            backgroundColor: Colors.lightRed,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,  // Different icon for friends list
        }}
      />
    </Tabs>
  );
}
