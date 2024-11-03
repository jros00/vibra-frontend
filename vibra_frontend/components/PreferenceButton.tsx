// PreferenceButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import config from '../config.json';

interface PreferenceButtonProps {
  preference: 'like' | 'dislike';
  track_id: number;
  activePreference: 'like' | 'dislike' | null;
  onPress: () => void;
}

const PreferenceButton: React.FC<PreferenceButtonProps> = ({ preference, track_id, activePreference, onPress }) => {
  const apiUrl = `http://${config.MY_IP}:8000/action/rate/`;

  const handlePress = async () => {
    try {
      await axios.post(apiUrl, { preference, track_id }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      onPress();
      console.log(`${preference} submitted for track_id: ${track_id}`);
    } catch (error) {
      console.error('Error submitting preference:', error);
    }
  };

  const buttonColor = activePreference === preference
    ? (preference === 'like' ? 'green' : 'red')
    : 'white';

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Icon
        name={preference === 'like' ? 'thumbs-up' : 'thumbs-down'}
        size={30}
        color={buttonColor}
      />
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
});

export default PreferenceButton;
