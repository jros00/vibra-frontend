// ShareButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Modal, View, FlatList, Text, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import config from '../config.json';

interface ShareButtonProps {
  track_id: number;
  conversations: Array<{ id: number; name: string }>;
}

const ShareButton: React.FC<ShareButtonProps> = ({ track_id, conversations }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleShare = async () => {
    setModalVisible(false);
  };

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Icon
          name="share"
          size={30} // Uniform size with other icons
          color="white" // White color
        />
      </TouchableOpacity>

      {/* Modal implementation */}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
});

export default ShareButton;
