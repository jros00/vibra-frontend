import React, { useState } from 'react';
import { Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '@/hooks/useUser';
import LikedSongsList from '@/components/LikedSongsList';
import { useThemeColor } from '@/components/Themed';

const ProfileScreen = () => {
  const { profile } = useUser();
  const backgroundColor = useThemeColor({}, 'background');
  
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(profile?.biography || "");

  const handleBioSave = () => {
    setIsEditingBio(false);
    profile.biography = bio;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: profile?.profile_picture }}
          style={styles.image}
        />
        <Text style={styles.name}>{profile?.username}</Text>

        <View style={styles.bioContainer}>
          {isEditingBio ? (
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              autoFocus
              multiline
            />
          ) : (
            <Text style={styles.bio}>{bio}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {isEditingBio ? (
            <TouchableOpacity onPress={handleBioSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsEditingBio(true)} style={styles.editButton}>
              <FontAwesome name="pencil" size={16} color="#fff" />
              <Text style={styles.editButtonText}>Edit bio</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tasteProfileBadge}>
        <View style={styles.greenCircle} />
        <Text style={styles.tasteProfileText}>
          <Text style={styles.boldText}>Taste profile: </Text>
          House Mouse
        </Text>
      </View>

      <Text style={styles.header}>Liked Songs</Text>
      <LikedSongsList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 40,
    paddingBottom: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    width: '80%',
    textAlign: 'center',
  },
  bioContainer: {
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
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
    backgroundColor: '#444',
    padding: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1, // Adds the outline
    borderColor: '#fff', // Outline color
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tasteProfileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#333',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  greenCircle: {
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
