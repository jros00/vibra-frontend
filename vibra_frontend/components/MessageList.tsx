import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types/Message';

interface MessageListProps {
  messages: Message[];
  flatListRef: React.RefObject<FlatList<Message>>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, flatListRef }) => {
  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.message}>
          <Text style={styles.sender}>{item.sender.username || 'Unknown sender'}:</Text>
          <Text>{item?.content || 'No content available'}</Text>
          <Text style={styles.timestamp}>
            {item?.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Invalid time'}
          </Text>
        </View>
      )}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
    />
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
});

export default MessageList;
