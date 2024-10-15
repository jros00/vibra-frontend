import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchChats, loadInitialRecommendations } from '@/services/ForYouApi';
import { playSong, stopAudio, togglePlayPause } from '@/services/AudioService';
import { Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';

interface Song {
  id: number;
  track_id: number;
  album_image: URL;
  artist_name: string;
  audio_url: URL;
  track_title: string;
}

export const useSongFeed = () => {
  const [songFeed, setSongFeed] = useState<Song[]>([]); // Default to empty array
  const [recommendations, setRecommendations] = useState<Song[]>([]); // Default to empty array
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [conversations, setConversations] = useState<{ id: number; name: string }[]>([]);
  const [cardHeight, setCardHeight] = useState<number>(0);

  const soundRef = useRef<Audio.Sound | null>(null);
  const isFocused = useIsFocused();

  // Initial data loading on mount
  useEffect(() => {
    const loadData = async () => {
      const initialRecs = await loadInitialRecommendations();
      const chats = await fetchChats();
      setRecommendations(initialRecs);
      setConversations(chats);
      console.log("Loaded initial recommendations:", initialRecs);

      if (initialRecs.length > 0) {
        const initialFeed = initialRecs.slice(0, 2).map((song, i) => ({ ...song, id: i }));
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

  const handlePlaySong = (audio_url: string) => {
    playSong(audio_url, soundRef, setIsPlaying);
  };

  const handleTogglePlayPause = () => {
    togglePlayPause(soundRef, isPlaying, setIsPlaying);
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
  };
};
