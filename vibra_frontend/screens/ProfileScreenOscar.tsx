import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ProfileHeader from '../components/ProfileHeaderOscar';
import ProfileBio from '../components/ProfileBioOscar';
import FollowButton from '../components/ProfileFollowButtonOscar';
import EditableProfileField from '../components/ProfileEditableFieldOscar';
import ProfileActivityFeed from '../components/ProfileActivityFeedOscar';
import { fetchProfileData, updateProfileField } from '../services/ProfileServiceOscar'; // Import the service
import { ProfileData } from '../types/ProfileDataOscar'; // Import the types

// Define the interface for route parameters
interface ProfileScreenRouteParams {
    username: string;
  }
  
  // Define the interface for the component props, including route
  interface ProfileScreenProps {
    route: { params: ProfileScreenRouteParams };
  }

const ProfileScreen = ({ route }) => {
    const { username } = route.params;
    const [profileData, setProfileData] = useState<ProfileData>({
        username: '',
        bio: '',
        profileImage: '',
        followerCount: 0,
        isFollowing: false,
        activities: [],
    });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchProfileData(route.params.username); // Fetch using username
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
  
    loadProfileData();
  }, [route.params.username]); // Update this to username
  
  const handleProfileUpdate = async (field: keyof ProfileData, newValue: string) => {
    try {
      await updateProfileField(route.params.username, field, newValue); // Update using username
      setProfileData((prevData) => ({ ...prevData, [field]: newValue }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfileHeader
        username={profileData.username}
        profileImage={profileData.profileImage}
        followerCount={profileData.followerCount}
      />
      
      <ProfileBio bio={profileData.bio} />

      <EditableProfileField
        label="Bio"
        value={profileData.bio}
        onSave={(newValue) => handleProfileUpdate('bio', newValue)}
      />

      <FollowButton isFollowing={profileData.isFollowing} userId={route.params.username} />

      <ProfileActivityFeed activities={profileData.activities} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
});

export default ProfileScreen;
