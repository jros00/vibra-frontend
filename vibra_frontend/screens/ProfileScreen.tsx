// ProfileScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useThemeColor } from '@/components/Themed';
import { useUser } from '@/hooks/useUser';
import LikedSongsList from '@/components/LikedSongsList';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { profile } = useUser();
  console.log(profile)
  const backgroundColor = useThemeColor({}, 'background');
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile?.biography || '');

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = () => {
    // Add your save logic here
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.profileSection}>
        <Image source={{ uri: profile?.profile_picture }} style={styles.image} />
        <Text style={styles.name}>{profile?.username}</Text>

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

        <TouchableOpacity style={styles.editButton} onPress={isEditing ? handleSave : handleEditToggle}>
          <FontAwesome name={isEditing ? "save" : "pencil"} size={16} color="#32CD32" />
          <Text style={styles.editButtonText}>{isEditing ? " Save" : " Edit bio"}</Text>
        </TouchableOpacity>

        {/* Taste Profile Badge */}
        <View style={[styles.tasteProfileBadge, { backgroundColor: '#333' }]}>
          <View style={[styles.colorCircle, { backgroundColor: profile?.taste_profile_color || '#32CD32' }]} />
          <Text style={styles.tasteProfileText}>
            <Text style={styles.boldText}>Taste profile:</Text> {profile?.taste_profile_title}
          </Text>
        </View>
      </View>

      <Text style={styles.header}>Liked Songs</Text>
      <LikedSongsList />
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
  },
  bio: {
    fontSize: 16,
    marginTop: 10,
    color: '#fff',
    width: '66%',
    textAlign: 'center',
  },
  bioInput: {
    fontSize: 16,
    color: '#fff',
    width: '66%',
    textAlign: 'center',
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#32CD32', // Outline color
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    width: '25%', // Match width to the bio text
    justifyContent: 'center', // Center the button content
  },
  editButtonText: {
    fontSize: 14,
    color: '#32CD32', // Match bio text color
    marginLeft: 5,
  },
  tasteProfileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#333',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
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
});

export default ProfileScreen;
