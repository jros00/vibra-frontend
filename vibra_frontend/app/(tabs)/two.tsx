import { FlatList, StyleSheet, Dimensions } from 'react-native';
import { ViewToken } from 'react-native'; // Import types from React Native
import SongCard from '@/components/SongCard';
import { Text, View } from '@/components/Themed';
import { useRef, useState } from 'react';

const { height } = Dimensions.get('window');

// Define the type for each song
interface Song {
  id: string;
  title: string;
  description: string;
  image: any; // You can specify more strict typing if needed (e.g., ImageSourcePropType)
}

// Dummy song data
const songs: Song[] = [
  { id: '1', title: 'Track 1', description: 'Interesting trivia for track 1', image: require('../../assets/images/cool-background.png') },
  { id: '2', title: 'Track 2', description: 'Interesting trivia for track 2', image: require('../../assets/images/cool-background.png') },
  { id: '3', title: 'Track 3', description: 'Interesting trivia for track 3', image: require('../../assets/images/cool-background.png') },
  { id: '4', title: 'Track 4', description: 'Interesting trivia for track 4', image: require('../../assets/images/cool-background.png') },
  { id: '5', title: 'Track 5', description: 'Interesting trivia for track 5', image: require('../../assets/images/cool-background.png') },
  { id: '6', title: 'Track 6', description: 'Interesting trivia for track 6', image: require('../../assets/images/cool-background.png') },

  // Add more tracks as needed
];


export default function ForYouScreen() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null); // State to track the current song
  const [cardHeight, setCardHeight] = useState<number>(0); // State to track the dynamic card height
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current; // Configuration for detecting which item is in view
  
  // Handler when a song comes into focus
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        const inFocus = viewableItems[0].item as Song; // Typecasting to Song
        setCurrentSong(inFocus); // Update current song in focus
        console.log(`Current Song in Focus: ${inFocus.title}`); // Log or handle the current song (for example, fetch it from the backend)
      }
    }
  ).current;

  // Function to dynamically capture the card's height when it renders
  const onCardLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setCardHeight(height); // Set the height of the card dynamically
  };

  return (
    <View style={styles.container}>
      {/* FlatList for vertical swiping between songs */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View onLayout={onCardLayout}>
            <SongCard
              image={item.image}
              title={item.title}
              description={item.description}
            />
          </View>
        )}
        pagingEnabled={true} // Snap to each song card
        showsVerticalScrollIndicator={false} // Hide scroll indicator
        snapToAlignment="center" // Snap each song to the center of the screen
        snapToInterval={cardHeight || height * 0.6} // Dynamically calculate the interval
        decelerationRate="fast" // Make scrolling feel smooth
        onViewableItemsChanged={onViewableItemsChanged} // Detect which item is in focus
        viewabilityConfig={viewabilityConfig} // Config to detect when a song comes into focus
      />
      {currentSong && (
        <View style={styles.currentSongContainer}>
          <Text style={styles.currentSongText}>Currently Playing: {currentSong.title}</Text>
        </View>
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
