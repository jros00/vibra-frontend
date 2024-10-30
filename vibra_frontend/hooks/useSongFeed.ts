import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchChats, loadInitialRecommendations, getRecommendations } from '@/services/ForYouApi'; // Assume `loadMoreRecommendations` is implemented
import { playSong, stopAudio, togglePlayPause } from '@/services/AudioService';
import { Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
import { Song } from '@/types/Song';

export const useSongFeed = () => {
  const [songFeed, setSongFeed] = useState<Song[]>([]); // Default to empty array
  const [recommendations, setRecommendations] = useState<Song[]>([]); // Default to empty array
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [conversations, setConversations] = useState<{ id: number; name: string }[]>([]);
  const [cardHeight, setCardHeight] = useState<number>(0);
  const [loadingMore, setLoadingMore] = useState(false); // New state to track loading more songs

  const soundRef = useRef<Audio.Sound | null>(null);
  const isFocused = useIsFocused();

  const [isChangingSong, setIsChangingSong] = useState(false); // New state to prevent overlapping calls

  // Initial data loading on mount
  useEffect(() => {
    const loadData = async () => {
      const initialRecs = await loadInitialRecommendations();
      const chats = await fetchChats();
      setRecommendations(initialRecs);
      setConversations(chats);
      console.log("Loaded initial recommendations:", initialRecs);

      if (initialRecs.length > 0) {
        const initialFeed = initialRecs.slice(0, 5); // Fetch the first 5 songs
        setSongFeed(initialFeed);
        console.log("Initial song feed set:", initialFeed);
      }
    };
    loadData();
  }, []);

  // Stop audio when screen loses focus
  useEffect(() => {
    if (!isFocused) {
      stopAudio(soundRef);
      setIsPlaying(false);
    }
  }, [isFocused]);

  // const handlePlaySong = (audio_url: string) => {
  //   playSong(audio_url, soundRef, setIsPlaying);
  // };

  // Await playSong: Ensures that handlePlaySong waits for playSong to complete before proceeding
  const handlePlaySong = async (audio_url: string) => {
    if (isChangingSong) return; // Prevent overlapping calls
    setIsChangingSong(true);
    try {
      await stopAudio(soundRef); // Ensure the current audio stops
      await playSong(audio_url, soundRef, setIsPlaying); // Play the new audio
    } catch (error) {
      console.error('Error in handlePlaySong:', error);
    } finally {
      setIsChangingSong(false);
    }
  };

  const handleTogglePlayPause = () => {
    togglePlayPause(soundRef, isPlaying, setIsPlaying);
  };

  const loadMoreSongs = async () => {
    if (loadingMore) return; // Prevent multiple requests at the same time
  
    setLoadingMore(true);
    try {
      const lastSong = songFeed[songFeed.length - 1]; // Get the last song in the feed
      const newSongs = await getRecommendations(lastSong?.track_id); // Fetch more songs based on the last song's track_id
      if (newSongs.length > 0) {
        setSongFeed((prevFeed) => [...prevFeed, ...newSongs]); // Append the new songs
      }
      console.log("Loaded more songs:", newSongs);
    } catch (error) {
      console.error("Error loading more songs:", error);
    } finally {
      setLoadingMore(false);
    }
  };
  

  return {
    songFeed,
    recommendations,
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
    soundRef,
    loadMoreSongs, // Return the loadMoreSongs function
  };
};
