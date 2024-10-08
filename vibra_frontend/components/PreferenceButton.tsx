// PreferenceButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import config from '../config.json';

interface PreferenceButtonProps {
  preference: 'like' | 'dislike';
  track_id: number;
}

const PreferenceButton: React.FC<PreferenceButtonProps> = ({ preference, track_id }) => {
  const handlePress = async () => {
    const apiUrl = `http://${config.MY_IP}:8000/action/rate/`;
    try {
      await axios.post(apiUrl, { preference, track_id }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(`${preference} submitted for track_id: ${track_id}`);
    } catch (error) {
      console.error('Error submitting preference:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Icon
        name={preference === 'like' ? 'thumbs-up' : 'thumbs-down'}
        size={30}
        color={preference === 'like' ? 'green' : 'red'}
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
