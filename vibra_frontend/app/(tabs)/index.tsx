import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { HelloWave } from '@/components/HelloWave';

import axios from 'axios';
import { useEffect, useState } from 'react';

import config from '../../config.json'
import Colors from '@/constants/Colors';

export default function TabOneScreen() {

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `http://localhost:8000/home/welcome/`;
    console.log(URL);
    axios
      .get(apiUrl)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setMessage('Error fetching message');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message}<HelloWave/></Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.sampleText}>This is a test to see if backend communication works. If it says "Welcome to Vibra!" above this message, this means connection with backend is working.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  sampleText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.textColorLight,
  },
});
