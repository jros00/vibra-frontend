// SongCardChat.tsx
import React, { useRef } from 'react';
import { Image, StyleSheet, TouchableOpacity, Dimensions, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SongCardChatProps {
  image: any;
  title: string;
  description: string;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
}

const { width, height } = Dimensions.get('window');

const SongCardChat: React.FC<SongCardChatProps> = ({
  image,
  title,
  description,
  isPlaying,
  onTogglePlayPause,
}) => {
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
      <LinearGradient colors={['#000', '#333']} style={styles.gradientBackground}>
        <Image source={image} style={styles.image} resizeMode="cover" />

        <Animated.View style={[styles.playPauseButton, { opacity: fadeAnim }]}>
          <Icon
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={80}
            color="rgba(255, 255, 255, 0.8)"
          />
        </Animated.View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  description: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
  },
});

export default SongCardChat;
