import React, { useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, Dimensions, Animated, View as RNView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import PreferenceButton from '@/components/PreferenceButton';
import ShareButton from '@/components/ShareButton';
import { Text, View } from './Themed';

// Utility function to convert RGB array to hex color string
const rgbToHex = (rgb: number[] = []): string => {
  return (
    '#' +
    rgb
      .map((value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
};

interface SongCardProps {
  image: any;
  title: string;
  description: string;
  track_id: number;
  conversations: Array<{ id: number; name: string }>;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  palette?: Array<Array<number>>;
  dominantColor?: Array<number>;
  sender?: any;
}

const { width, height } = Dimensions.get('window');

const SongCard: React.FC<SongCardProps> = ({
  image,
  title,
  description,
  track_id,
  conversations,
  isPlaying,
  onTogglePlayPause,
  palette = [],
  dominantColor = [0, 0, 0],
  sender = null
}) => {
  
  // State to track active preference
  const [activePreference, setActivePreference] = useState<'like' | 'dislike' | null>(null);

  // Handle preference change
  const handlePreferenceChange = (preference: 'like' | 'dislike') => {
    if (activePreference === preference) {
      setActivePreference(null); // Deselect if the same button is pressed again
    } else {
      setActivePreference(preference); // Set the new active preference
    }
  };

  // Convert the dominant color and palette to hex
  const dominantColorHex = rgbToHex(dominantColor);
  const paletteHex = palette.map((rgbArray) => rgbToHex(rgbArray));

  // Ensure we have at least two colors for the gradient
  const gradientColors = [dominantColorHex, ...paletteHex];

  // If fewer than two colors, add a fallback color
  if (gradientColors.length < 2) {
    gradientColors.push('#ffffff'); // Adding white as a fallback
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handlePlayPause = () => {
    onTogglePlayPause();

    fadeAnim.setValue(1);
    Animated.sequence([
      Animated.delay(500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity onPress={handlePlayPause} style={styles.cardContainer}>
      <LinearGradient colors={gradientColors} style={styles.gradientBackground}>

        {/* Conditional rendering for sender */}
        {sender && (
          <View style={styles.textContainer}><Text style={styles.text}>Recommended by <Text style={styles.senderText}>{sender}</Text></Text></View>
        )}


        <Image source={image} style={styles.image} resizeMode="cover" />

        {/* Play/Pause Button Overlay with Animated Visibility */}
        <Animated.View style={[styles.playPauseButton, { opacity: fadeAnim }]}>
          <Icon
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={80}
            color="rgba(255, 255, 255, 0.8)"
          />
        </Animated.View>

        {/* Buttons and Gradient Background on the Right Side */}
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.8)', 'transparent']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.buttonGradient}
        >
          <RNView style={styles.buttonContainer}>
            <PreferenceButton preference="like" track_id={track_id} activePreference={activePreference} onPress={() => handlePreferenceChange('like')} />
            <PreferenceButton preference="dislike" track_id={track_id} activePreference={activePreference} onPress={() => handlePreferenceChange('dislike')} />
            <ShareButton track_id={track_id} conversations={conversations} />
          </RNView>
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width,
    height: height,
    alignSelf: 'center',
  },
  gradientBackground: {
    flex: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  senderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01161e',
    fontStyle: 'italic', // Makes the text italic (cursive-like)
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01161e',
  },
  textContainer: {
    borderRadius: 100,
    backgroundColor: '#00f5d4',
    paddingLeft: 20,
    padding: 10,
    margin: 10
  },
  image: {
    marginTop: 30,
    opacity: 1,
    width: '100%',
    height: '60%',
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  playPauseButton: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
  buttonGradient: {
    position: 'absolute',
    right: 20,
    top: '41%',
    width: 70,
    height: 200,
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default SongCard;
