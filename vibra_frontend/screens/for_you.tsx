import { FlatList, StyleSheet, Dimensions } from 'react-native';
import { ViewToken } from 'react-native'; // Import types from React Native
import SongCard from '@/components/SongCard';
import NowPlayingBar from '@/components/NowPlayingBar';
import { Text, View } from '@/components/Themed';
import { useEffect, useRef, useState } from 'react';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av'; // Import Expo AV for audio playback
import axios from 'axios';
<<<<<<< HEAD:vibra_frontend/screens/for_you.tsx
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import config from '../config.json'


=======
import { useIsFocused } from '@react-navigation/native';
import config from '../../config.json';
>>>>>>> c7bae5d (Code for login, messages and notifications):vibra_frontend/app/(tabs)/for_you.tsx

const { height } = Dimensions.get('window');

// Define the type for each song
interface Song {
  id: number;
  track_id: number;
  album_image: string;
  album_image_palette: Array<Array<number>>;
  album_image_dominant_color: Array<number>;
  album_name: string;
  audio_url: string;
  title: string;
}

export default function ForYouScreen() {
  // State management
  const [songFeed, setSongFeed] = useState<Song[]>([]);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [cardHeight, setCardHeight] = useState<number>(0);
  const [playbackPosition, setPlaybackPosition] = useState<number>(0); // NEW: Store playback position

  // Refs
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const isSoundLoading = useRef<boolean>(false);

  // Configure audio settings
  const enableAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });
      console.info('Audio mode successfully configured.');
    } catch (error) {
      console.error('Failed to set audio mode:', error);
    }
  };

<<<<<<< HEAD:vibra_frontend/screens/for_you.tsx
  // Ref to hold the Audio.Sound object
  const soundRef = useRef<Audio.Sound | null>(null);

  // Get recommendations from back-end
  const getRecommendations = async(id: Number) => {
    const apiUrl = `http://${config.MY_IP}:8000/for_you/recommended/`;
=======
  // Fetch recommendations from the backend
  const getRecommendations = async (id: number) => {
    const apiUrl = `http://localhost:8000/for_you/recommended/`;
>>>>>>> c7bae5d (Code for login, messages and notifications):vibra_frontend/app/(tabs)/for_you.tsx
    try {
      const res = await axios.post(apiUrl, { track_id: id }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setRecommendations(res.data);
    } catch (error) {
      console.error('Error sending POST request for recommendations:', error);
    }
  };

<<<<<<< HEAD:vibra_frontend/screens/for_you.tsx
  // NEW: Function to load initial recommendations (GET request)
  const loadInitialRecommendations = async() => {
    const apiUrl = `http://${config.MY_IP}:8000/for_you/recommended/`;
=======
  // Load initial recommendations on screen load
  const loadInitialRecommendations = async () => {
    const apiUrl = `http://localhost:8000/for_you/recommended/`;
>>>>>>> c7bae5d (Code for login, messages and notifications):vibra_frontend/app/(tabs)/for_you.tsx
    try {
      const res = await axios.get(apiUrl, {
        headers: { 'Content-Type': 'application/json' },
      });
      setRecommendations(res.data);
      console.info('Initial recommendations loaded.');
    } catch (error) {
      console.error('Error sending GET request for initial recommendations:', error);
    }
  };

  // Initialize audio settings and recommendations on component mount
  useEffect(() => {
    enableAudio();
    loadInitialRecommendations();
  }, []);

  // Update song feed based on recommendations
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      if (songFeed.length === 0) {
        const feed: Song[] = recommendations.slice(0, 2).map((rec, i) => ({
          id: i,
          track_id: rec.track_id,
          title: rec.title,
          album_name: rec.album_name,
          album_image: rec.album_image,
          album_image_palette: rec.album_image_palette,
          album_image_dominant_color: rec.album_image_dominant_color,
          audio_url: rec.audio_url,
        }));
        setSongFeed(feed);
      } else if (currentSong && currentSong.id === songFeed[songFeed.length - 1].id) {
        let addedSong = false;
        let i = 0;
        const feed = [...songFeed];

        while (!addedSong && i < recommendations.length) {
          const song = {
            id: songFeed.length + 1,
            track_id: recommendations[i].track_id,
            title: recommendations[i].title,
            album_name: recommendations[i].album_name,
            album_image: recommendations[i].album_image,
            album_image_palette: recommendations[i].album_image_palette,
            album_image_dominant_color: recommendations[i].album_image_dominant_color,
            audio_url: recommendations[i].audio_url,
          };

          if (!songFeed.some((existingSong) => existingSong.track_id === song.track_id)) {
            feed.push(song);
            addedSong = true;
          } else {
            console.info('Song already exists in song feed.');
          }
          i++;
        }
        setSongFeed(feed);
      }
    }
  }, [recommendations]);

  // Play a song based on the audio URL and position
  const playSong = async (audio_url: string, position: number = 0) => {
    if (isSoundLoading.current) {
      console.info('Song loading is already in progress.');
      return;
    }

    isSoundLoading.current = true;

    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
    }

    soundRef.current = null;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audio_url },
        { shouldPlay: true, positionMillis: position }
      );
      soundRef.current = sound;
      console.info(`Playing song from position ${position}`);
    } catch (error) {
      console.error('Error playing sound:', error);
    }

    isSoundLoading.current = false;
  };

  // Detect when a song is in focus and play it
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    if (viewableItems.length > 0) {
      const inFocusSong = viewableItems[0].item as Song;
      setCurrentSong(inFocusSong);
      getRecommendations(inFocusSong.track_id);
      console.info(`Song in focus: ${inFocusSong.title}`);
      playSong(inFocusSong.audio_url);
    }
  }).current;

  // Capture the height of each card dynamically
  const onCardLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setCardHeight(height);
  };

  // Handle playback when screen is focused/unfocused
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && currentSong) {
      console.info('Screen is focused, resuming playback.');
      if (playbackPosition > 0) {
        playSong(currentSong.audio_url, playbackPosition);
      }
    } else if (!isFocused && soundRef.current) {
      console.info('Screen is unfocused, stopping playback.');
      soundRef.current.getStatusAsync().then((status) => {
        if (status.isLoaded) {
          setPlaybackPosition(status.positionMillis);
        }
      });
      soundRef.current.stopAsync().then(() => {
        soundRef.current?.unloadAsync();
        soundRef.current = null;
      });
    }
  }, [isFocused]);

  return (
    <View>
      {/* FlatList for vertical swiping between songs */}
      <FlatList
        data={songFeed}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View onLayout={onCardLayout}>
            <SongCard image={{ uri: item.album_image }} palette={item.album_image_palette} dominantColor={item.album_image_dominant_color} />
          </View>
        )}
<<<<<<< HEAD:vibra_frontend/screens/for_you.tsx
        // Conditionally set props based on the platform
        pagingEnabled={Platform.OS !== 'web'} // Enable paging only on mobile
        showsVerticalScrollIndicator={false}
        snapToAlignment={Platform.OS !== 'web' ? 'start' : undefined}
        snapToInterval={Platform.OS !== 'web' ? cardHeight : undefined}
        decelerationRate={Platform.OS !== 'web' ? 'fast' : undefined}
=======
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={cardHeight}
        decelerationRate="fast"
>>>>>>> c7bae5d (Code for login, messages and notifications):vibra_frontend/app/(tabs)/for_you.tsx
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        overScrollMode="never" // This prop can be left as is; it doesn't affect web
      />
      {currentSong && (
        <NowPlayingBar
          title={currentSong.title}
          artist={currentSong.album_name}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  currentSongContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  currentSongText: {
    color: '#fff',
    fontSize: 18,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});