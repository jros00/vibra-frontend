import React, { useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
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
    loadMoreSongs,
  } = useSongFeed();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (viewableItems?.length > 0) {
        const inFocusSong = viewableItems[0].item;
        setCurrentSong(inFocusSong);
        handlePlaySong(inFocusSong.audio_url);
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
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())} // Add index as fallback
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
                palette={item.album_image_palette}
                dominantColor={item.album_image_dominant_color}
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
          onEndReached={loadMoreSongs} // Trigger when end is reached
          onEndReachedThreshold={0.5}  // Load more when the user is halfway through the current list
          ListFooterComponent={<ActivityIndicator size="small" color="#0000ff" />} // Show loading indicator when loading more songs
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
