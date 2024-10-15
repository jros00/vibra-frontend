import React, { useState } from 'react';
import { TouchableOpacity, Modal, View, FlatList, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import config from '../config.json';

interface ShareButtonProps {
  track_id: number;
  conversations: Array<{ id: number; name: string }>;
}

const ShareButton: React.FC<ShareButtonProps> = ({ track_id, conversations }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleShare = async (conversationId: number) => {
    try {
      const apiUrl = `http://${config.MY_IP}:8000/conversations/${conversationId}/share/`;
      await axios.post(apiUrl, { track_id });
      Alert.alert('Success', `Track shared with conversation ${conversationId}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to share track');
      console.error(error);
    } finally {
      setModalVisible(false);
    }
  };

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Icon name="share" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share with:</Text>
            <FlatList
              data={conversations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.conversationItem}
                  onPress={() => handleShare(item.id)}
                >
                  <Text style={styles.conversationText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    marginTop: 50, // Adjust this value to move content further down
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  conversationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  conversationText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default ShareButton;