import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';


interface SongCardProps {
    image: any; // Accepts the image source (can be a local image using require or a URI string
    palette: Array<Array<number>>;
    dominantColor: Array<number>;
  }


// Utility function to convert RGB array to hex color string
const rgbToHex = (rgb: number[]): string => {
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
  

const SongCard: React.FC<SongCardProps> = ({image, palette, dominantColor}) => {

  // Convert the RGB arrays to hex strings
  const dominantColorHex = rgbToHex(dominantColor);
  const paletteHex = palette.map((rgbArray) => rgbToHex(rgbArray));

  // Use the dominant color and the palette for the gradient
  const gradientColors = [dominantColorHex, ...paletteHex];

  return (
    
    <LinearGradient colors={gradientColors} style={styles.cardContainer}>
      {/* Image Container */}
        <Image
          source={image}
          style={styles.image}
          resizeMode="cover"
        />
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  cardContainer: {
    // card container covers whole screen
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
    alignSelf: 'center'
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  sampleText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default SongCard;
