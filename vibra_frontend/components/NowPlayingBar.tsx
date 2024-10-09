import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


interface NowPlayingBarProps {
    title: string;
    artist: string;
  }
  
  const NowPlayingBar: React.FC<NowPlayingBarProps> = ({ title, artist }) => {
    console.log(title, artist);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artist}</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#865DFF', // Dark background for the bar
      paddingVertical: 15,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#333',
    },
    title: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
    },
    artist: {
      color: '#ccc',
      fontSize: 16,
    },
  });
  
  export default NowPlayingBar;