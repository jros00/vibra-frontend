import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NowPlayingBarProps {
  title: string;
  artist: string;
}

const NowPlayingBar: React.FC<NowPlayingBarProps> = ({ title, artist }) => {
  return (
    <View style={styles.nowPlayingContainer}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.artistText}>{artist}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  nowPlayingContainer: {
    position: 'absolute',
    bottom: 20, // Elevate it 20 pixels from the bottom
    alignSelf: 'center',
    backgroundColor: '#865DFF', // Customize background color
    paddingVertical: 15, // Consistent padding
    paddingHorizontal: 30,
    borderRadius: 15, // Rounded corners
    width: '90%', // Adjust width to fit within the screen
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5, // Adds shadow for Android
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold', // Bold for the title
    color: '#fff',
    textAlign: 'center',
  },
  artistText: {
    fontSize: 16,
    fontWeight: '400', // Regular weight for artist name
    color: '#ccc',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default NowPlayingBar;
