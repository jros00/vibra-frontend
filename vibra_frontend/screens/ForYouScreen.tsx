import React, { SetStateAction, useEffect, useRef, useState, useCallback } from 'react';
import { FlatList, StyleSheet, Dimensions, View as RNView, TouchableOpacity } from 'react-native';
import { ViewToken } from 'react-native';
import SongCard from '@/components/SongCard';
import NowPlayingBar from '@/components/NowPlayingBar';
import PreferenceButton from '@/components/PreferenceButton';
import ShareButton from '@/components/ShareButton';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Platform, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../config.json';

const { height } = Dimensions.get('window');

// Define the type for each song
interface Song {
  id: number;
  track_id: number;
  album_image: URL;
  artist_name: string;
  audio_url: URL;
  track_title: string;
}

export default function ForYouScreen() {
  const [songFeed, setSongFeed] = useState<Array<Song>>([]);
  const [recommendations, setRecommendations] = useState<Array<Song>>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true); // Track if song is playing
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [conversations, setConversations] = useState<Array<{ id: number; name: string }>>([]);
  const [cardHeight, setCardHeight] = useState<number>(0);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const soundRef = useRef<Audio.Sound | null>(null);

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
      console.log('Audio mode configured successfully');
    } catch (error) {
      console.error('Failed to set audio mode:', error);
    }
  };

  const fetchChats = async () => {
    const apiUrl = `http://${config.MY_IP}:8000/conversations/`;
    console.log('Fetching chats from:', apiUrl);
    try {
      const response = await axios.get(apiUrl);
      console.log('Fetched chat data:', response.data); // Log the data
      return response.data.map((chat) => ({
        id: chat.id,
        name: chat.group_name,
      }));
    } catch (error) {
      console.error('Error fetching chats:', error); // Log detailed error
      return [];
    }
  };

  const getRecommendations = async (id: number) => {
    const apiUrl = `http://${config.MY_IP}:8000/for_you/recommended/`;
    try {
      const res = await axios.post(apiUrl, { track_id: id }, { headers: { 'Content-Type': 'application/json' } });
      setRecommendations(res.data);
    } catch (error) {
      console.error('Error sending POST request', error);
    }
  };

  const loadInitialRecommendations = async () => {
    const apiUrl = `http://${config.MY_IP}:8000/for_you/recommended/`;
    try {
      const res = await axios.get(apiUrl, { headers: { 'Content-Type': 'application/json' } });
      setRecommendations(res.data);
    } catch (error) {
      console.error('Error sending GET request', error);
    }
  };

  useEffect(() => {
    enableAudio();
    loadInitialRecommendations();

    const getChats = async () => {
      const chats = await fetchChats();
      setConversations(chats);
    };
    getChats();
  }, []);

  useEffect(() => {
    if (recommendations && recommendations.length > 0 && songFeed.length === 0) {
      const initialFeed = recommendations.slice(0, 2).map((song, i) => ({ ...song, id: i }));
      setSongFeed(initialFeed);
    }
  }, [recommendations]);

  const playSong = async (audio_url: any) => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audio_url }, { shouldPlay: true });
      soundRef.current = sound;
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const togglePlayPause = async () => {
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(!isPlaying); // Toggle play/pause state
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    if (viewableItems.length > 0) {
      const inFocus = viewableItems[0].item as Song;
      setCurrentSong(inFocus);
      getRecommendations(inFocus.track_id);
      playSong(inFocus.audio_url);
    }
  }).current;

  const onCardLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setCardHeight(height);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (soundRef.current) {
          soundRef.current.stopAsync().then(() => {
            soundRef.current?.unloadAsync();
            soundRef.current = null;
          }).catch(error => console.error('Error stopping sound:', error));
        }
      };
    }, [])
  );

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']} // Define gradient colors
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          data={songFeed}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={togglePlayPause} onLayout={onCardLayout}>
              <SongCard
                image={{ uri: item.album_image }}
                title={item.track_title}
                description={item.artist_name}
              />
            </TouchableOpacity>
          )}
          pagingEnabled={Platform.OS !== 'web'}
          showsVerticalScrollIndicator={false}
          snapToAlignment={Platform.OS !== 'web' ? 'start' : undefined}
          snapToInterval={Platform.OS !== 'web' ? cardHeight : undefined}
          decelerationRate={Platform.OS !== 'web' ? 'fast' : undefined}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          overScrollMode="never"
        />

        <RNView style={styles.buttonContainer}>
          {currentSong && (
            <>
              <PreferenceButton preference="like" track_id={currentSong.track_id} />
              <PreferenceButton preference="dislike" track_id={currentSong.track_id} />
              <ShareButton track_id={currentSong.track_id} conversations={conversations} />
            </>
          )}
        </RNView>

        {currentSong && (
          <NowPlayingBar
            title={currentSong.track_title}
            artist={currentSong.artist_name}
          />
        )}
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
    backgroundColor: 'transparent', // Ensure the SafeAreaView background is transparent
  },
  flatListContainer: {
    paddingTop: 20,
    paddingBottom: 50,
  },
  buttonContainer: {
    position: 'absolute',
    right: 20,
    top: '55%',
    alignItems: 'center',
  },
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
});
