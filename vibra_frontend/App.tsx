import React, { useCallback } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import AppNavigator from './navigation/AppNavigator';
import './axiosSetup'; // Import the Axios setup to initialize interceptors
import { UserProvider } from '@/contexts/userContext';
import colors from './constants/Colors';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);


SplashScreen.preventAutoHideAsync();

const App = () => {
  const colorScheme = useColorScheme();
  const customTheme = {
    ...((colorScheme === 'dark' ? DarkTheme : DefaultTheme)),
    colors: {
      ...((colorScheme === 'dark' ? colors.dark : colors.light)),  // Use your theme's colors based on the color scheme
    },
  };

  // Load fonts using `useFonts` from `expo-font`
  const [fontsLoaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'), // Make sure the path is correct
  });

  // Callback to hide splash screen once fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Show nothing until fonts are loaded, keeping splash screen visible
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <NavigationContainer theme={customTheme}>
        <UserProvider>
          <AppNavigator/>
        </UserProvider>
      </NavigationContainer>
    </View>
  );
};

export default App;
