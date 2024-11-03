import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useThemeColor } from '@/components/Themed'; // Adjust the import path as necessary

const sampleTracks = Array.from({ length: 15 }, (_, index) => ({
  id: index.toString(),
  title: `Sample Song ${index + 1}`,
  artist: `Artist ${index + 1}`,
  coverArt: 'https://via.placeholder.com/60',
}));

const LikedSongsList = () => {
  // Get background color from the theme
  const backgroundColor = useThemeColor({}, 'background'); // Adjust based on your theme key

  return (
    <View style={[styles.listContainer, { backgroundColor }]}>
      <FlatList
        data={sampleTracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.trackItem}>
            <Image source={{ uri: item.coverArt }} style={styles.coverArt} />
            <View style={styles.trackInfo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    // Background color will be set dynamically
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    
  },
  coverArt: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  artist: {
    fontSize: 14,
    color: '#d3d3d3', // Light gray for artist name
  },
});

export default LikedSongsList;
