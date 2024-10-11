import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      right: 20,
      top: '40%',
      alignItems: 'center',
    },
    currentSongContainer: {
      position: 'absolute',
      bottom: 30,
      left: 0,
      right: 0,
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 10,
    },
    currentSongText: {
      color: '#fff',
      fontSize: 18,
    },
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
  });
  