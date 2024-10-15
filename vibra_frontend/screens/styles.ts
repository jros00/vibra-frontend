import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flatListContainer: {
    paddingTop: 0,
    paddingBottom: 50,
  },
  buttonGradient: {
    position: 'absolute',
    top: '40.5%', // Adjust to match the button container's location
    right: 0,
    width: 60, // Width of the gradient background
    height: 200, // Height of the gradient background
    justifyContent: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 20,
    
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
