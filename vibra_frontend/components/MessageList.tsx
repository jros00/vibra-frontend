import React from 'react';
import { FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { View } from '@/components/Themed'
import { Message } from '@/types/Message';

interface MessageListProps {
  messages: Message[];
  flatListRef: React.RefObject<FlatList<Message>>;
  onSongPress: (message: Message) => void;
  currentUserId: number; 
}

const MessageList: React.FC<MessageListProps> = ({ messages, flatListRef, onSongPress, currentUserId }) => {
  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const isCurrentUser = item.sender.id === currentUserId;

        return (
          <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer]}>
            {/* Sender Information (displayed above the message bubble for all messages) */}
            <View style={[styles.senderContainer, isCurrentUser && styles.currentUserSenderContainer]}>
              {item.sender.profile_picture ? (
                <Image
                  source={{ uri: item.sender.profile_picture }}
                  style={styles.profilePicture}
                />
              ) : (
                <View style={styles.placeholderPicture} />
              )}
              <Text style={styles.sender}>{item.sender.username || 'Unknown sender'}</Text>
            </View>
            
            {/* Track Bubble */}
            {item.track && (
              <View style={[styles.messageBubble, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
                <TouchableOpacity onPress={() => onSongPress(item)} style={styles.songContainer}>
                  <Image source={{ uri: item.track.album_image }} style={styles.albumCover} />
                  <View style={styles.songDetails}>
                    <Text style={styles.songTitle}>{item.track.track_title}</Text>
                    <Text style={styles.artistName}>{item.track.artist_name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Content Bubble */}
            {item.content && (
              <View style={[styles.messageBubble, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
            )}


            {/* Timestamp */}
            <Text style={styles.timestamp}>
              {item?.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Invalid time'}
            </Text>
          </View>
        );
      }}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
    />
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  currentUserContainer: {
    alignItems: 'flex-end', // Aligns the bubble and sender info to the right for the current user
  },
  otherUserContainer: {
    alignItems: 'flex-start', // Aligns the bubble and sender info to the left for others
  },
  senderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  currentUserSenderContainer: {
    flexDirection: 'row-reverse', // Reverses sender info for the current user to align with the right side
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  placeholderPicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#cccccc',
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 15,
  },
  currentUserBubble: {
    backgroundColor: '#514C92',
    borderBottomRightRadius: 0,
  },
  otherUserBubble: {
    backgroundColor: '#9C96E3',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: '#fff',
    marginTop: 5,
  },
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  songDetails: {
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
  },
  sender: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MessageList;
