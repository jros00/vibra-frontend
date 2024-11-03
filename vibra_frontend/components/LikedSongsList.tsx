import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useThemeColor } from '@/components/Themed';
import TrackItem from './TrackItem';

const sampleTracks = Array.from({ length: 15 }, (_, index) => ({
  id: index.toString(),
  title: `Sample Song ${index + 1}`,
  artist: `Artist ${index + 1}`,
  coverArt: 'https://via.placeholder.com/60',
}));

const LikedSongsList = () => {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.listContainer, { backgroundColor }]}>
      <FlatList
        data={sampleTracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackItem
            title={item.title}
            artist={item.artist}
            coverArt={item.coverArt}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
  },
});

export default LikedSongsList;
