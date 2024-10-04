import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SongCardProps {
  image: any; // Accepts the image source (can be a local image using require or a URI string)
  palette?: Array<Array<number>>; // Optional array of arrays for colors
  dominantColor?: Array<number>; // Optional dominant color array
  title: string;
  description: string;
}

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

const SongCard: React.FC<SongCardProps> = ({ image, palette = [], dominantColor = [0, 0, 0] }) => {
  // Convert the RGB arrays to hex strings
  const dominantColorHex = rgbToHex(dominantColor);
  const paletteHex = palette.map((rgbArray) => rgbToHex(rgbArray));

  // Ensure we have at least two colors for the gradient
  const gradientColors = [dominantColorHex, ...paletteHex];

  // If fewer than two colors, add a fallback color
  if (gradientColors.length < 2) {
    gradientColors.push('#ffffff'); // Adding white as a fallback
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.cardContainer}>
      {/* Image Container */}
      <Image source={image} style={styles.image} resizeMode="cover" />
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  cardContainer: {
    // Card container covers whole screen
    width: width,
    height: height,
    padding: 20,
    opacity: 0.5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    alignSelf: 'center',
  },
  image: {
    opacity: 1,
    width: '100%',
    height: '60%',
    alignSelf: 'center',
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
});

export default SongCard;
