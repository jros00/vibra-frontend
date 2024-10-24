import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProfileBioProps {
  bio: string;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => {
  return (
    <View style={styles.bioContainer}>
      <Text style={styles.bioText}>{bio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bioContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  bioText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default ProfileBio;
