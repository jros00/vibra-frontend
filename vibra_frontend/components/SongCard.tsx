import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';


interface SongCardProps {
    image: any; // Accepts the image source (can be a local image using require or a URI string)
    title: string; // Title of the song
    description: string; // Additional text or description under the title
  }
  

const SongCard: React.FC<SongCardProps> = ({image, title, description}) => {
  return (
    <View style={styles.cardContainer}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Title and Sample Text */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sampleText}>{description}</Text>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.9, // Covers roughly 90% of screen width
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    alignSelf: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    width: '100%',
    height: height * 0.4, // Takes roughly 40% of screen height
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
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
