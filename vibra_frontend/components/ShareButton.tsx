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
  const [selectedConversations, setSelectedConversations] = useState<number[]>([]);

  const handleShare = async () => {
    if (selectedConversations.length === 0) return;
    const apiUrl = `http://${config.MY_IP}:8000/action/share/`;
    try {
      await axios.post(
        apiUrl,
        {
          track_id,
          group_ids: selectedConversations,
          message: "This track is great!",
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      Alert.alert('Success', 'Track shared with selected conversations');
      setModalVisible(false);
      setSelectedConversations([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to share track');
      console.error('Error sharing track:', error);
    }
  };

  const toggleModal = () => setModalVisible(!modalVisible);

  const toggleConversationSelection = (conversationId: number) => {
    setSelectedConversations((prevSelected) =>
      prevSelected.includes(conversationId)
        ? prevSelected.filter(id => id !== conversationId)
        : [...prevSelected, conversationId]
    );
  };

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
            <Text style={styles.modalTitle}>Select Conversations</Text>
            <FlatList
              data={conversations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.conversationItem,
                    selectedConversations.includes(item.id) && styles.selectedConversation,
                  ]}
                  onPress={() => toggleConversationSelection(item.id)}
                >
                  <Text style={styles.conversationText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ flexGrow: 1 }}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={toggleModal} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                style={[styles.shareButton, selectedConversations.length === 0 && styles.disabledButton]}
                disabled={selectedConversations.length === 0}
              >
                <Text style={styles.buttonText}>Share Track</Text>
              </TouchableOpacity>
            </View>
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
    marginTop: 0,
    maxHeight: '95%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  listContainer: {
    maxHeight: 200, // Limit height of the list container to make it scrollable if too long
  },
  conversationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  selectedConversation: {
    backgroundColor: '#d3d3d3',
  },
  conversationText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  shareButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ShareButton;
