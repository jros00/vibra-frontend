import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Platform, SafeAreaView, ActivityIndicator, ViewToken } from 'react-native';
import { useSongFeed } from '@/hooks/useSongFeed';
import SongCard from '@/components/SongCard';
import NowPlayingBar from '@/components/NowPlayingBar';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { stopAudio } from '@/services/AudioService';
import { Song } from '@/types/Song';

const user_array = [
  'Johannes',
  'Emilia',
  'Oscar',
  'Hugo',
  'Laura'
]

function getRandomValue<T>(array: T[]): any {
  if (array.length === 0) return undefined; // Handle empty array case
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Function to determine if the random selection should be executed (1/3 chance)
function pickSongSender(): any {
  const pickUser = Math.random() < 1 / 3;
  if (pickUser === true) {
    const user_name = getRandomValue(user_array)
    return user_name
  }
  else {
    return null
  }
}


export default function ForYouScreen() {
  const {
    songFeed,
    isPlaying,
    currentSong,
    conversations,
    handlePlaySong,
    handleTogglePlayPause,
    setCurrentSong,
    cardHeight,
    setCardHeight,
    soundRef, // Destructure soundRef here
    loadMoreSongs,
  } = useSongFeed();

  // Add `sender` property to each song in the `songFeed` on initial load
  const [processedSongFeed, setProcessedSongFeed] = useState<Song[]>([]);

  useEffect(() => {
    const updatedFeed = songFeed.map((song) => {
      const sender = pickSongSender()
      return { ...song, sender };
    });
    setProcessedSongFeed(updatedFeed);
  }, [songFeed]);

  const [inFocusSong, setInFocusSong] = useState<Song | null>(null);; // Track the currently focused song
  const playingRef = useRef(false); // Track if a song is currently playing or loading

  // Handle updating the in-focus song from visible items
  const onViewableItemsChanged = useCallback(
      ({ viewableItems }: { viewableItems: any }) => {
        if (viewableItems?.length > 0) {
          const song = viewableItems[0].item;
          console.info("In focus:", song.track_title);
          setInFocusSong(song); // Update the focused song
        }
      },
      []
  );


  // useEffect to play the song when inFocusSong changes
  useEffect(() => {
    if (inFocusSong && currentSong?.track_id !== inFocusSong.track_id && !playingRef.current) {
      playingRef.current = true; // Set flag to prevent overlapping playback
      setCurrentSong(inFocusSong);

      handlePlaySong(inFocusSong.audio_url)
        .then(() => {
          playingRef.current = false; // Reset flag when playback starts
        })
        .catch((error) => {
          console.warn("Error in playback:", error);
          playingRef.current = false; // Reset flag in case of an error
        });
    }

    else if (inFocusSong && currentSong?.track_id !== inFocusSong.track_id && playingRef.current) {
      handlePlaySong(inFocusSong.audio_url)
      .then(() => {
        playingRef.current = false; // Reset flag when playback starts
      })
      .catch((error) => {
        console.warn("Error in playback:", error);
        playingRef.current = false; // Reset flag in case of an error
      });
    }
  }, [inFocusSong, currentSong, setCurrentSong, handlePlaySong, soundRef]);


  const onCardLayout = (event: any) => {
    setCardHeight(event.nativeEvent.layout.height);
  };


  useFocusEffect(
    useCallback(() => {
      return () => {
        stopAudio(soundRef);
        playingRef.current = false; // Reset on component unmount
      };
    }, [soundRef])
  );

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradientBackground}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={processedSongFeed}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())} // Add index as fallback
          renderItem={({ item }) => {
            return (
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
                  sender={item.sender} // Pass the result of the function
                />
              </TouchableOpacity>
            );
          }}
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

        {inFocusSong && <NowPlayingBar title={inFocusSong.track_title} artist={inFocusSong.artist_name} />}
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
