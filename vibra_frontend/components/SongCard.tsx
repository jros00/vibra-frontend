import React, { useRef } from 'react';
import { Image, StyleSheet, TouchableOpacity, Dimensions, Animated, View as RNView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import PreferenceButton from '@/components/PreferenceButton';
import ShareButton from '@/components/ShareButton';

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
  imageMargin?: number;
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
  imageMargin = 30
}) => {
  // Convert the dominant color and palette to hex
  const dominantColorHex = rgbToHex(dominantColor);
  const paletteHex = palette.map((rgbArray) => rgbToHex(rgbArray));

  // Ensure we have at least two colors for the gradient
  const gradientColors = [dominantColorHex, ...paletteHex];

  // If fewer than two colors, add a fallback color
  if (gradientColors.length < 2 || palette.length === 0) {
    gradientColors.splice(0, gradientColors.length, 'transparent'); 
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
        <Image source={image} style={[styles.image, {marginTop: imageMargin}]} resizeMode="cover" />

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
            <PreferenceButton preference="like" track_id={track_id} />
            <PreferenceButton preference="dislike" track_id={track_id} />
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
  image: {
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
