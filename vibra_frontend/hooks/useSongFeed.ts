import { useState, useEffect, useRef, useCallback, SetStateAction } from 'react';
import { Song } from '@/types/Song';
import { Audio } from 'expo-av';
import { ViewToken } from 'react-native';
import { getRecommendations, fetchChats, loadInitialRecommendations } from '@/services/ForYouApi';
import { playSong } from '@/services/AudioService';
import { useIsFocused } from '@react-navigation/native';


export const useSongFeed = () => {
    const [songFeed, setSongFeed] = useState<Array<Song>>([]);
    const [recommendations, setRecommendations] = useState<Array<Song>>([]);
    const [isPlaying, setIsPlaying] = useState<boolean>(true); // Track if song is playing
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [conversations, setConversations] = useState<Array<{ id: number; name: string }>>([]);
    const [cardHeight, setCardHeight] = useState<number>(0);
    const [playbackPosition, setPlaybackPosition] = useState<number>(0); // Store playback position

    // Refs
    const soundRef = useRef<Audio.Sound | null>(null);
    const isSoundLoading = useRef<boolean>(false);
    

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
        const chats = await fetchChats();
        setConversations(chats);
        const recs = await loadInitialRecommendations();
        setRecommendations(recs);
        };
        loadData();
    }, []);

    // Handle playback when screen is focused/unfocused
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && currentSong) {
            console.info('Screen is focused, resuming playback.');
            if (playbackPosition > 0) {
                playSong(currentSong.audio_url, isSoundLoading, soundRef, setIsPlaying, playbackPosition);
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

    // Update song feed based on recommendations
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
        if (songFeed.length === 0) {
            const feed: Song[] = recommendations.slice(0, 2).map((rec, i) => ({
            id: i,
            track_id: rec.track_id,
            track_title: rec.track_title,
            artist_name: rec.artist_name,
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
                track_title: recommendations[i].track_title,
                artist_name: recommendations[i].artist_name,
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

    // Handle viewability changes for FlatList
    const onViewableItemsChanged = useRef(
        async ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
        if (viewableItems.length > 0) {
        const inFocusSong = viewableItems[0].item as Song;
        setCurrentSong(inFocusSong);
        const newRecs = await getRecommendations(inFocusSong.track_id);
        setRecommendations(newRecs)
        playSong(inFocusSong.audio_url, isSoundLoading, soundRef, setIsPlaying)
        }
    }).current;

    const onCardLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setCardHeight(height);
    };

    const handleTogglePlayPause = async () => {
        if (soundRef.current) {
        if (isPlaying) {
            await soundRef.current.pauseAsync();
        } else {
            await soundRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
        }
    };

    return {
        songFeed,
        currentSong,
        isPlaying,
        handleTogglePlayPause,
        onViewableItemsChanged,
        cardHeight,
        onCardLayout,
        conversations,
    };
};
