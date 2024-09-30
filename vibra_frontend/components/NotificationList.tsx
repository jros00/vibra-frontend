import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<string[]>([]);

  // Use the custom hook for WebSocket connection
  useWebSocket('notifications', (data) => {
    setNotifications((prevNotifications) => [...prevNotifications, data.message]);
  });

  return (
    <View style={{ padding: 10 }}>
      <ScrollView>
        {notifications.map((notification, index) => (
          <Text key={index}>{notification}</Text>
        ))}
      </ScrollView>
    </View>
  );
}
