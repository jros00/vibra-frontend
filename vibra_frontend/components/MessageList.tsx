import React from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { Message } from '@/types/Message';

interface MessageListProps {
  messages: Message[];
  flatListRef: React.RefObject<FlatList<Message>>;
  onSongPress: (message: Message) => void; // Add a press handler for song messages
}

const MessageList: React.FC<MessageListProps> = ({ messages, flatListRef, onSongPress }) => {
  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.message}>
          <Text style={styles.sender}>{item.sender.username || 'Unknown sender'}:</Text>

          {/* Check if the message contains a song */}
          {item.track ? (
            <View style={styles.songContainer}>
              {/* Album Cover */}
              <TouchableOpacity onPress={() => onSongPress(item)}>
                <Image
                  source={{ uri: item.track.album_image }}
                  style={styles.albumCover}
                />
              </TouchableOpacity>

              {/* Song Title and Artist */}
              <View style={styles.songDetails}>
                <Text style={styles.songTitle}>{item.track.track_title}</Text>
                <Text style={styles.artistName}>{item.track.artist_name}</Text>
              </View>
            </View>
          ) : (
            // Regular message content
            <Text>{item.content || 'No content available'}</Text>
          )}

          {/* Timestamp */}
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
  songContainer: {
    flexDirection: 'row', // Place album cover and song details side by side
    alignItems: 'center',
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  songDetails: {
    flex: 1, // Allow song details to fill available space
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  artistName: {
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
});

export default MessageList;
