import React, { useState } from 'react';
import { Button } from 'react-native';
import axios from 'axios';
import config from '../config.json'

interface FollowButtonProps {
    isFollowing: boolean;
    username: string;  // Use username
  }
  
  const FollowButton: React.FC<FollowButtonProps> = ({ isFollowing, username }) => {
    const [following, setFollowing] = useState(isFollowing);
  
    const toggleFollow = async () => {
      try {
        if (following) {
          await axios.post(`http://${config.MY_IP}:8000/unfollow/${username}`);
        } else {
          await axios.post(`http://${config.MY_IP}:8000/follow/${username}`);
        }
        setFollowing(!following);
      } catch (error) {
        console.error('Error updating follow status:', error);
      }
    };
  
    return (
      <Button
        title={following ? 'Unfollow' : 'Follow'}
        onPress={toggleFollow}
        color={following ? 'gray' : 'blue'}
      />
    );
  };
  

export default FollowButton;
