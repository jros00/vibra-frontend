// ShareButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, Modal, View, FlatList, Button, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Add an icon for sharing if desired
import axios from 'axios';
import config from '../config.json';

interface ShareButtonProps {
  track_id: number;
  conversations: Array<{ id: number; name: string }>;
}

const ShareButton: React.FC<ShareButtonProps> = ({ track_id, conversations }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState<Array<number>>([]);

  const handleShare = async () => {
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
      console.log('Track shared successfully');
      setModalVisible(false); // Close modal after sharing
    } catch (error) {
      console.error('Error sharing track:', error);
    }
  };

  const toggleConversation = (id: number) => {
    setSelectedConversations((prev) =>
      prev.includes(id) ? prev.filter((convId) => convId !== id) : [...prev, id]
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Icon name="share" size={30} color="blue" />
      </TouchableOpacity>

      {/* Modal for selecting conversations */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Conversations to Share</Text>
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.conversationItem,
                  selectedConversations.includes(item.id) && styles.selectedConversation,
                ]}
                onPress={() => toggleConversation(item.id)}
              >
                <Text style={styles.conversationText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Share Track" onPress={handleShare} disabled={selectedConversations.length === 0} />
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
