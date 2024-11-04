import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface TrackItemProps {
  title: string;
  artist: string;
  coverArt: string;
}

const TrackItem: React.FC<TrackItemProps> = ({ title, artist, coverArt }) => {
  return (
    <View style={styles.trackItem}>
      <Image source={{ uri: coverArt }} style={styles.coverArt} />
      <View style={styles.trackInfo}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artist}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: '#d3d3d3',
  },
});

export default TrackItem;
