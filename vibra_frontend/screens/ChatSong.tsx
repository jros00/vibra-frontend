import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SongCard from '@/components/SongCard';
import NowPlayingBar from '@/components/NowPlayingBar';
import { stopAudio, playSong } from '@/services/AudioService';
import { View, Text } from '@/components/Themed';
import { GradientView } from '@/components/GradientView';
import { Audio } from 'expo-av';

const { height } = Dimensions.get('window');

const SongDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedMessage, songMessages } = route.params;

  const [currentTrack, setCurrentTrack] = useState(selectedMessage.track);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cardHeight, setCardHeight] = useState(height);
  const soundRef = useRef(null);
  const flatListRef = useRef<FlatList<Message>>(null);
  const isScrollingRef = useRef(false);

  const handlePlaySong = (audioUrl: string) => {
    stopAudio(soundRef); // Stop previous audio
    playSong(audioUrl, soundRef, setIsPlaying); // Start new audio
  };
  

  const handleTogglePlayPause = () => {
    togglePlayPause(soundRef, isPlaying, setIsPlaying);
  };

  const togglePlayPause = async (
    soundRef: React.MutableRefObject<Audio.Sound | null>,
    isPlaying: boolean,
    setIsPlaying: (isPlaying: boolean) => void
  ) => {
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };
  


  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: {viewableItems: any}) => {
      if (isScrollingRef.current) {
        // Ignore updates during initial scroll
        isScrollingRef.current = false;
        return;
      }
      if (viewableItems?.length > 0) {
        const inFocusSong = viewableItems[0].item.track;
        if (inFocusSong.track_id !== currentTrack.track_id) {
          setCurrentTrack(inFocusSong);
          // Do not call handlePlaySong here
        }
      }
    },
    [currentTrack]
  );
  

  const onCardLayout = (event: { nativeEvent: { layout: { height: React.SetStateAction<number>; }; }; }) => {
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
      (message: { track: { track_id: any; }; }) => message.track.track_id === selectedMessage.track.track_id
    );
    if (flatListRef.current && selectedIndex !== -1) {
      isScrollingRef.current = true;
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
    <GradientView style={styles.gradientBackground}>
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
                sender={item.sender.username}
                conversations={[]}
                />
            </TouchableOpacity>
          )}
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={cardHeight}
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
            });
          }}
        />

        {currentTrack && <View style={styles.playingBar}><NowPlayingBar title={currentTrack.track_title} artist={currentTrack.artist_name}/></View> }
      </SafeAreaView>
    </GradientView>
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
  playingBar: {
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 65,
    left: 10,
    zIndex: 1,
  },
  arrowBack: {
    marginTop: 20
  }
});

export default SongDetail;
