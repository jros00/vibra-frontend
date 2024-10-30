import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { View } from '@/components/Themed';
import { useUser } from '@/hooks/useUser';

const ProfileScreen = () => {
  const { profile } = useUser();
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profile?.profile_picture }}
        style={styles.image}
      />
      <Text style={styles.name}>{profile?.username}</Text>
      <Text style={styles.bio}>{profile?.biography}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,  // Adjust size as desired
    height: 120, // Adjust size as desired
    borderRadius: 60, // Half of the width/height to make it round
    marginBottom: 20,
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
  },
});

export default ProfileScreen;
