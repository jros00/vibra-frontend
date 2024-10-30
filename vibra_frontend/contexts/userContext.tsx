import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/UserProfile';

interface UserContextProps {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load profile from AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    };
    loadProfile();
  }, []);

  const saveProfile = (profile: UserProfile | null) => {
    setProfile(profile);
    if (profile) {
      AsyncStorage.setItem('userProfile', JSON.stringify(profile)); // Save profile to storage
    } else {
      AsyncStorage.removeItem('userProfile'); // Clear profile from storage
    }
  };

  return (
    <UserContext.Provider value={{ profile, setProfile: saveProfile }}>
      {children}
    </UserContext.Provider>
  );
};