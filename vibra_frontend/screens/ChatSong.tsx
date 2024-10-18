import React, { useState, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import SongCardChat from '@/components/SongCardChat';

const { height, width } = Dimensions.get('window');

const SongDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedMessage, songMessages } = route.params;
  const [currentTrack, setCurrentTrack] = useState(selectedMessage.track);
  const [isPlaying, setIsPlaying] = useState(true);
  const flatListRef = useRef(null);
  const soundRef = useRef(null);

  const playAudio = async (audioUrl) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    soundRef.current = sound;
    await sound.playAsync();
    setIsPlaying(true);
  };

  const pauseAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio(currentTrack.audio_url);
    }
  };

  useEffect(() => {
    playAudio(currentTrack.audio_url);

    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
      }
    };
  }, [currentTrack]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
      }
    });
    return unsubscribe;
  }, [navigation]);

  // Find the index of the selected song in the songMessages array
  const selectedIndex = songMessages.findIndex(message => message.track.track_id === selectedMessage.track.track_id);

  useEffect(() => {
    // Scroll to the selected song when the screen is first opened
    if (flatListRef.current && selectedIndex !== -1) {
      flatListRef.current.scrollToIndex({ index: selectedIndex, animated: false });
    }
  }, [selectedIndex]);

  const onViewableItemsChanged = ({ viewableItems }) => {
    const track = viewableItems[0]?.item.track;
    if (track && track.track_id !== currentTrack.track_id) {
      setCurrentTrack(track);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={songMessages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.songCardContainer}>
            <SongCardChat
              image={{ uri: item.track.album_image }}
              title={item.track.track_title}
              description={item.track.artist_name}
              isPlaying={currentTrack.track_id === item.track.track_id && isPlaying}
              onTogglePlayPause={togglePlayPause}
            />
          </View>
        )}
        getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
        pagingEnabled
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={height} // Ensures smooth scrolling for each song card
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        bounces={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#192f6a',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  songCardContainer: {
    height: height, // Ensures each card takes up the full screen height
    justifyContent: 'center',
  },
});

export default SongDetail;
