import React, { useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { useSongFeed } from '@/hooks/useSongFeed';
import SongCard from '@/components/SongCard';
import NowPlayingBar from '@/components/NowPlayingBar';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { stopAudio } from '@/services/AudioService';

export default function ForYouScreen() {
  const {
    songFeed,
    isPlaying,
    currentSong,
    conversations,
    handlePlaySong,
    handleTogglePlayPause,
    setCurrentSong,
    setRecommendations,
    setSongFeed,
    cardHeight,
    setCardHeight,
    soundRef, // Destructure soundRef here
  } = useSongFeed();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      console.log("Viewable items changed:", viewableItems);
      if (viewableItems?.length > 0) {
        const inFocusSong = viewableItems[0].item;
        setCurrentSong(inFocusSong);
        handlePlaySong(inFocusSong.audio_url);
        console.log("Now playing song:", inFocusSong);
      }
    },
    [setCurrentSong, handlePlaySong]
  );

  const onCardLayout = (event: any) => {
    setCardHeight(event.nativeEvent.layout.height);
  };

  useFocusEffect(
    useCallback(() => {
      return () => stopAudio(soundRef);
    }, [soundRef])
  );

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradientBackground}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={songFeed}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={handleTogglePlayPause} onLayout={onCardLayout}>
              <SongCard
                image={{ uri: item.album_image }}
                title={item.track_title}
                description={item.artist_name}
                track_id={item.track_id}
                conversations={conversations}
                isPlaying={isPlaying}
                onTogglePlayPause={handleTogglePlayPause}
              />
            </TouchableOpacity> 
          )}
          pagingEnabled={Platform.OS !== 'web'}
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={Platform.OS !== 'web' ? cardHeight : undefined}
          decelerationRate={Platform.OS !== 'web' ? 'fast' : undefined}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          bounces={false}
          overScrollMode="never"
        />
        {currentSong && <NowPlayingBar title={currentSong.track_title} artist={currentSong.artist_name} />}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
