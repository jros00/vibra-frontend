import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface ActivityFeedProps {
  activities: { id: number; type: string; content: string }[];  // Customize as per activity data structure
}

const ProfileActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.activityItem}>
          <Text>{item.type}: {item.content}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  activityItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
});

export default ProfileActivityFeed;
