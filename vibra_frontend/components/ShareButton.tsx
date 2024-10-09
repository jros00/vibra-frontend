import React, { useState } from 'react';
import { TouchableOpacity, Text, Modal, View, FlatList, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import config from '../config.json';

interface ShareButtonProps {
  track_id: number;
  conversations: Array<{ id: number; name: string }>;
}

const ShareButton: React.FC<ShareButtonProps> = ({ track_id, conversations }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  const handleShare = async () => {
    if (selectedConversation === null) return; // Ensure a conversation is selected
    const apiUrl = `http://${config.MY_IP}:8000/action/share/`;
    try {
      await axios.post(
        apiUrl,
        {
          track_id,
          group_ids: [selectedConversation], // Use array to match backend structure
          message: "This track is great!",
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`Track shared with conversation ID ${selectedConversation}`);
      setModalVisible(false); // Close modal after sharing
    } catch (error) {
      console.error('Error sharing track:', error);
    }
  };

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Icon name="share" size={30} color="blue" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Conversation</Text>
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.conversationItem,
                  selectedConversation === item.id && styles.selectedConversation,
                ]}
                onPress={() => setSelectedConversation(item.id)}
              >
                <Text style={styles.conversationText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Share Track" onPress={handleShare} disabled={selectedConversation === null} />
          <Button title="Cancel" onPress={toggleModal} />
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
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  conversationItem: {
    padding: 10,
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  selectedConversation: {
    backgroundColor: '#d3d3d3',
  },
  conversationText: {
    fontSize: 16,
  },
});

export default ShareButton;
