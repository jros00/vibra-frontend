import React from 'react';
import { FlatList, View, Text, Image, StyleSheet } from 'react-native';
import { Message } from '@/types/Message';

interface MessageListProps {
  messages: Message[];
  flatListRef: React.RefObject<FlatList<Message>>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, flatListRef }) => {
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      {item.track ? (
        // Layout for messages containing track information
        <View style={styles.trackMessage}>
          <Image source={{ uri: item.track.album_image }} style={styles.albumCover} />
          <View style={styles.trackDetails}>
            <Text style={styles.songTitle}>{item.track.track_title}</Text>
            <Text style={styles.artistName}>{item.track.artist_name}</Text>
            <Text style={styles.sender}>{item.sender.username}:</Text>
            <Text>{item.content || 'No content available'}</Text>
          </View>
        </View>
      ) : (
        // Layout for regular text messages
        <View style={styles.textMessage}>
          <Text style={styles.sender}>{item.sender.username}:</Text>
          <Text>{item.content || 'No content available'}</Text>
        </View>
      )}
      <Text style={styles.timestamp}>
        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Invalid time'}
      </Text>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderMessage}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
    />
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 5,
    padding: 10,
  },
  textMessage: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  trackMessage: {
    flexDirection: 'row',
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 8,
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  trackDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  artistName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  sender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default MessageList;
