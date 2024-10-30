import React, { useState } from 'react';
import { Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { loginUser } from '../services/authService';
import { fetchUserProfile } from '../services/profileService';
import { useUser } from '../hooks/useUser';

const predefinedUsers = [
  { id: 1, name: 'Emilia' },
  { id: 2, name: 'Johannes' },
  { id: 3, name: 'Oscar' },
  { id: 4, name: 'Laura' },
  { id: 5, name: 'Hugo' },
];

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const { setProfile } = useUser();
  const [loading, setLoading] = useState(false);                       
  const [csrfToken, setCsrfToken] = useState<string | null>(null);     
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async (userName: string) => {
    setLoading(true);
    const loginResponse = await loginUser(userName, csrfToken);

    if (loginResponse) {
      const profileData = await fetchUserProfile(userName);
      if (profileData) {
        setProfile(profileData);
        navigation.navigate('Main');
      } else {
        Alert.alert('Error', 'Could not load profile data');
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a User to Login</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        predefinedUsers.map((user) => (
          <Button
            key={user.id}
            title={`Login as ${user.name}`}
            onPress={() => handleLogin(user.name)}
            disabled={loading}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
});
