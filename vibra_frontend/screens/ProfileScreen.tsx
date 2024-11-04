// ProfileScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useThemeColor } from '@/components/Themed';
import { useUser } from '@/hooks/useUser';
import LikedSongsList from '@/components/LikedSongsList';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { profile } = useUser();
  const backgroundColor = useThemeColor({}, 'background');
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile?.biography || '');

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.profileSection}>
        <Image source={{ uri: profile?.profile_picture }} style={styles.image} />
        <Text style={styles.name}>{profile?.username}</Text>

        {/* Followers and Following Section Container */}
        <View style={styles.followContainer}>
          <View style={styles.followSection}>
            <View style={styles.followItem}>
              <Text style={styles.followCount}>482</Text>
              <Text style={styles.followLabel}>Followers</Text>
            </View>
            <View style={styles.followItem}>
              <Text style={styles.followCount}>248</Text>
              <Text style={styles.followLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Taste Profile Badge positioned between followers section and bio */}
        <View style={[styles.tasteProfileBadge, { backgroundColor: '#333' }]}>
          <View style={[styles.colorCircle, { backgroundColor: profile?.taste_profile_color || '#32CD32' }]} />
          <Text style={styles.tasteProfileText}>
            <Text style={styles.boldText}>Taste profile:</Text> {profile?.taste_profile_title}
          </Text>
        </View>

        <View style={styles.bioContainer}>
          {isEditing ? (
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              multiline
            />
          ) : (
            <Text style={styles.bio}>{bio}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.editButton} onPress={isEditing ? handleSave : handleEditToggle}>
          <FontAwesome name={isEditing ? "save" : "pencil"} size={16} color="#32CD32" />
          <Text style={styles.editButtonText}>{isEditing ? " Save" : " Edit bio"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Liked Songs</Text>

      {profile?.liked_tracks?.length > 0 ? (
        <LikedSongsList />
      ) : (
        <Text style={styles.noSongsText}>No liked songs yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 0,
    marginTop: 80,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  // Followers/Following Container
  followContainer: {
    backgroundColor: '#B3A8F5', // Background for the container
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 0,
    alignItems: 'center',
  },
  followSection: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  followItem: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  followCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  followLabel: {
    fontSize: 14,
    color: '#444',
  },
  bioContainer: {
    backgroundColor: '#8C9AF5',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    marginTop: 5,
  },
  bio: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  bioInput: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#32CD32',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    width: '25%',
    justifyContent: 'center',
    marginBottom: 5,
  },
  editButtonText: {
    fontSize: 14,
    color: '#32CD32',
    marginLeft: 5,
  },
  tasteProfileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#333',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#32CD32',
    marginRight: 10,
  },
  tasteProfileText: {
    color: '#fff',
    fontSize: 14,
  },
  boldText: {
    fontWeight: 'bold',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  noSongsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfileScreen;
