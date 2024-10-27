import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SongCard from '@/components/SongCard';
import NowPlayingBar from '@/components/NowPlayingBar';
import { stopAudio, playSong } from '@/services/AudioService';

const { height } = Dimensions.get('window');

const SongDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedMessage, songMessages } = route.params; // Only load songs from the chat

  const [currentTrack, setCurrentTrack] = useState(selectedMessage.track);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cardHeight, setCardHeight] = useState(height); // Set card height to screen height
  const soundRef = useRef(null);
  const flatListRef = useRef(null);

  const handlePlaySong = (audioUrl) => {
    playSong(audioUrl, soundRef, setIsPlaying);
  };

  const handleTogglePlayPause = () => {
    if (isPlaying) {
      stopAudio(soundRef);
      setIsPlaying(false);
    } else {
      handlePlaySong(currentTrack.audio_url);
    }
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (viewableItems?.length > 0) {
        const inFocusSong = viewableItems[0].item.track;
        if (inFocusSong.track_id !== currentTrack.track_id) {
          setCurrentTrack(inFocusSong);
          handlePlaySong(inFocusSong.audio_url);
        }
      }
    },
    [currentTrack, handlePlaySong]
  );

  const onCardLayout = (event) => {
    setCardHeight(event.nativeEvent.layout.height);
  };

  useEffect(() => {
    handlePlaySong(currentTrack.audio_url);

    return () => {
      stopAudio(soundRef);
    };
  }, [currentTrack]);

  useEffect(() => {
    const selectedIndex = songMessages.findIndex(
      (message) => message.track.track_id === selectedMessage.track.track_id
    );
    if (flatListRef.current && selectedIndex !== -1) {
      flatListRef.current.scrollToIndex({ index: selectedIndex, animated: false });
    }
  }, [selectedMessage, songMessages]);

  // Use useFocusEffect to stop the audio when navigating back to the chat
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopAudio(soundRef); // Stop the audio when the screen loses focus
      };
    }, [soundRef])
  );

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradientBackground}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={songMessages} // Only use the chat's song messages
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())} // Fallback for key
          renderItem={({ item }) => (
            <TouchableOpacity onPress={handleTogglePlayPause} onLayout={onCardLayout}>
              <SongCard
                image={{ uri: item.track.album_image }}
                title={item.track.track_title}
                description={item.track.artist_name}
                track_id={item.track.track_id}
                isPlaying={currentTrack.track_id === item.track.track_id && isPlaying}
                onTogglePlayPause={handleTogglePlayPause}
                palette={item.track.album_image_palette}
                dominantColor={item.track.album_image_dominant_color}
              />
            </TouchableOpacity>
          )}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={cardHeight}
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />

        {currentTrack && <NowPlayingBar title={currentTrack.track_title} artist={currentTrack.artist_name} />}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});

export default SongDetail;
