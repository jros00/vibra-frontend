import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ViewToken, LayoutChangeEvent } from 'react-native';
import { useRoute, useNavigation, useFocusEffect, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SongCard from '@/components/SongCard';
import NowPlayingBar from '@/components/NowPlayingBar';
import { stopAudio, playSong } from '@/services/AudioService';
import { Message } from '@/types/Message';
import LikedByItem from '@/components/LikedByItem';
import { View } from '@/components/Themed';

const { height } = Dimensions.get('window');

const getItemLayout = (data: ArrayLike<any> | null | undefined, index: number) => ({
  length: height,
  offset: height * index,
  index,
});

const SongDetail = () => {
  const route = useRoute<RouteProp<{ params: { selectedMessage: any; songMessages: any[] } }, 'params'>>();
  const navigation = useNavigation();
  const { selectedMessage, songMessages } = route.params; // Only load songs from the chat

  const [currentTrack, setCurrentTrack] = useState(selectedMessage.track);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cardHeight, setCardHeight] = useState(height); // Set card height to screen height
  const soundRef = useRef(null);
  const flatListRef = useRef<FlatList<any>>(null);
  const [gradientColors, setGradientColors] = useState<string[]>(['transparent']);

  // Utility function to convert RGB array to hex color string
  const rgbToHex = (rgb: number[] = []): string => {
    return '#' + rgb.map(value => value.toString(16).padStart(2, '0')).join('');
  };

  // Function to set gradient colors from track properties
  const updateGradientColors = (palette: Array<number[]> | undefined, dominantColor: number[] | undefined) => {
    const dominantColorHex = dominantColor ? rgbToHex(dominantColor) : 'transparent';
    const paletteHex = palette ? palette.map(rgb => rgbToHex(rgb)) : [];

    // If the palette has colors, use it; otherwise, fallback to the dominant color and transparency
    const colors = paletteHex.length > 1 ? paletteHex : [dominantColorHex, 'transparent'];
    setGradientColors(colors);
  };

  useEffect(() => {
    // Update gradient when the current track changes
    if (currentTrack) {
      updateGradientColors(currentTrack.album_image_palette, currentTrack.album_image_dominant_color);
    }
  }, [currentTrack]);

  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    console.warn(`Scroll to index failed: ${info.index}`);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
    }
  };

  const handlePlaySong = (audioUrl: string) => {
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
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
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

  const onCardLayout = (event: LayoutChangeEvent) => {
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
      (message: Message) => message.track?.track_id === selectedMessage.track.track_id
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
    <LinearGradient colors={gradientColors} style={styles.gradientBackground}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={songMessages} // Only use the chat's song messages
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())} // Fallback for key
          renderItem={({ item }) => (
            <View style={styles.songCardContainer}>
              <View style={styles.likedByItem}>
                <LikedByItem liked_by={item.sender}/>
              </View>
              <TouchableOpacity onPress={handleTogglePlayPause} onLayout={onCardLayout}>
                <SongCard
                  image={{ uri: item.track.album_image }}
                  title={item.track.track_title}
                  description={item.track.artist_name}
                  track_id={item.track.track_id}
                  isPlaying={currentTrack.track_id === item.track.track_id && isPlaying}
                  onTogglePlayPause={handleTogglePlayPause}
                  conversations={item.conversations || []}
                  imageMargin={130}
                />
              </TouchableOpacity>
            </View>
          )}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={cardHeight}
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={handleScrollToIndexFailed}
        />
        {currentTrack && <NowPlayingBar title={currentTrack.track_title} artist={currentTrack.artist_name} />}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  songCardContainer: {
    position: 'relative',
    backgroundColor: 'transparent'
  },
  likedByItem: {
    position: 'absolute',
    top: 30, // Adjust this value to control vertical positioning
    zIndex: 2, // Ensure it stays above SongCard
  },
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
