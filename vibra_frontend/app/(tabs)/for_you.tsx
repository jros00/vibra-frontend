import { FlatList, StyleSheet, Dimensions } from 'react-native';
import { ViewToken } from 'react-native'; // Import types from React Native
import SongCard from '@/components/SongCard';
import NowPlayingBar from '@/components/NowPlayingBar';
import { Text, View } from '@/components/Themed';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid  } from 'expo-av'; // Import Expo AV for audio playback
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import config from '../../config.json'



const { height } = Dimensions.get('window');

// Define the type for each song
interface Song {
  id: Number,
  track_id: Number
  album_image: URL;
  artist_name: string;
  audio_url: URL;
  track_title: string;
}


export default function ForYouScreen() {
  
  const [songFeed, setSongFeed] = useState<Array<Song>>([]) // state to track the Song Feed
  const [recommendations, setRecommendations] = useState<Array<Song>>([]); // state to track the recommendations
  const [currentSong, setCurrentSong] = useState<Song | null>(null); // State to track the current song
  const [cardHeight, setCardHeight] = useState<number>(0); // State to track the dynamic card height
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current; // Configuration for detecting which item is in view



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

  // Ref to hold the Audio.Sound object
  const soundRef = useRef<Audio.Sound | null>(null);

  // Get recommendations from back-end
  const getRecommendations = async(id: Number) => {
    const apiUrl = `http://${config.MY_IP}:8000/for_you/recommended/`;
    try {
      const res = await axios.post(
        apiUrl,
        { track_id: id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setRecommendations(res.data);
    } catch (error) {
      console.error('Error sending POST request', error);
    }
  };

  // NEW: Function to load initial recommendations (GET request)
  const loadInitialRecommendations = async() => {
    const apiUrl = `http://${config.MY_IP}:8000/for_you/recommended/`;
    try {
      // Sending GET request instead of POST
      const res = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRecommendations(res.data); // Setting initial recommendations
    } catch (error) {
      console.error('Error sending GET request', error);
    }
  };

  // Trigger the initial GET request on page load
  useEffect(() => {
    enableAudio();
    loadInitialRecommendations(); // Load recommendations on page load
  }, []);

   // Update the songFeed when recommendations change
   useEffect(() => {
    if (recommendations && recommendations.length > 0) {

      if (songFeed.length == 0) {

        let feed: SetStateAction<Song[]> = []
        let i = 0;

        while (feed.length < 2) {
          let song = {
            id: i,
            track_id: recommendations[i].track_id,
            track_title: recommendations[i].track_title,
            artist_name: recommendations[i].artist_name,
            album_image: recommendations[i].album_image,
            audio_url: recommendations[i].audio_url,
          }
          feed.push(song);
          i++;
        }
        console.log('Updated feed:')
        feed.forEach((el) => {
          console.log(`${el.id} ${el.track_title}`)
        });
        setSongFeed(feed);
      }

      else if (currentSong && currentSong.id == songFeed[songFeed.length-1].id) {

        console.info('Recommendations:')
        recommendations.forEach(recommendation => {
          console.log(recommendation);
        })

        let feed = [...songFeed];
        let addedSong = false;
        let i = 0;

        while (!addedSong && i < recommendations.length) {
          let song = {
            id: songFeed.length + 1,
            track_id: recommendations[i].track_id,
            track_title: recommendations[i].track_title,
            artist_name: recommendations[i].artist_name,
            album_image: recommendations[i].album_image,
            audio_url: recommendations[i].audio_url,
          }
          console.log('Trying to add song: ', song.track_title);
          if (songFeed.some(existingSong => existingSong.track_id === song.track_id)) {
            console.log('Song already in song feed.');
          }
          else {
            feed.push(song);
            addedSong = true;
          }
          i++;
        }
        console.log('Updated feed:')
        feed.forEach((el) => {
          console.log(`${el.id} ${el.track_title}`)
        });
        setSongFeed(feed); // Update song feed with new song
      }
    }
  }, [recommendations]);


  // NEW: Function to play the song
  const playSong = async (audio_url: any) => {
    // Stop and unload previous sound if any
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    // Load and play new sound
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audio_url },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      console.log('Playing sound: ', audio_url);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  

  // Handler when a song comes into focus
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        const inFocus = viewableItems[0].item as Song; // Typecasting to Song
        setCurrentSong(inFocus); // Update current song in focus
        getRecommendations(inFocus.track_id);
        console.log(`Current Song in Focus: ${inFocus.track_title}`); // Log or handle the current song (for example, fetch it from the backend)

        // NEW: Play the song in focus
        playSong(inFocus.audio_url)
      }
    }
  ).current;

  // Function to dynamically capture the card's height when it renders
  const onCardLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    console.log('Height: ', height);
    setCardHeight(height); // Set the height of the card dynamically
  };


  // Use useFocusEffect to handle screen focus changes
  useFocusEffect(
    useCallback(() => {
      // Screen is focused
      console.log('ForYouScreen has focus');

      // Optionally, you can resume playback if needed

      return () => {
        // Screen is unfocused
        console.log('ForYouScreen lost focus');

        // Stop and unload sound
        if (soundRef.current) {
          soundRef.current.stopAsync().then(() => {
            soundRef.current?.unloadAsync();
            soundRef.current = null;
          }).catch((error) => {
            console.error('Error stopping sound on screen unfocus:', error);
          });
        }
      };
    }, [])
  );



  return (
    <View>
      {/* FlatList for vertical swiping between songs */}
      <FlatList
        data={songFeed}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View onLayout={onCardLayout}>
            <SongCard
              image={{ uri: item.album_image }}
              title={item.track_title}
              description={item.artist_name}
            />
          </View>
        )}
        // Conditionally set props based on the platform
        pagingEnabled={Platform.OS !== 'web'} // Enable paging only on mobile
        showsVerticalScrollIndicator={false}
        snapToAlignment={Platform.OS !== 'web' ? 'start' : undefined}
        snapToInterval={Platform.OS !== 'web' ? cardHeight : undefined}
        decelerationRate={Platform.OS !== 'web' ? 'fast' : undefined}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        overScrollMode="never" // This prop can be left as is; it doesn't affect web
      />
      {/* Render the NowPlayingBar only if there's a current song */}
      {currentSong && (
        <NowPlayingBar
          title={currentSong.track_title}
          artist={currentSong.artist_name}
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
