import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Predefined users
const predefinedUsers = [
  { id: 1, name: 'Emilia' },
  { id: 2, name: 'Johannes' },
  { id: 3, name: 'Oscar' },
  { id: 4, name: 'Laura' },
  { id: 5, name: 'Hugo' },
];

export default function UserListScreen() {
  const navigation = useNavigation();

  const handleUserSelect = (userId: number) => {
    navigation.navigate('messages/MessagesPage', { recipientId: userId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a User</Text>
      {predefinedUsers.map((user) => (
        <Button
          key={user.id}
          title={`Message ${user.name}`}
          onPress={() => handleUserSelect(user.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
