import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProfileHeaderProps {
  username: string;
  profileImage: string;
  followerCount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, profileImage, followerCount }) => {
  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: profileImage }} style={styles.profileImage} />
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.followerCount}>{followerCount} Followers</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  followerCount: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
});

export default ProfileHeader;
