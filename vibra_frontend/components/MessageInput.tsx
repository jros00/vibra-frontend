import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (text: string) => void;
  handleSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ newMessage, setNewMessage, handleSend }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default MessageInput;
