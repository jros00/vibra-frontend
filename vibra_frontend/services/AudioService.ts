import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

export const enableAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
    console.log('Audio mode configured successfully');
  } catch (error) {
    console.error('Failed to set audio mode:', error);
  }
};

export const playSong = async (
  audio_url: string,
  soundRef: React.MutableRefObject<Audio.Sound | null>,
  setIsPlaying: (isPlaying: boolean) => void
) => {
  if (soundRef.current) {
    await soundRef.current.stopAsync();
    await soundRef.current.unloadAsync();
    soundRef.current = null;
  }
  try {
    const { sound } = await Audio.Sound.createAsync({ uri: audio_url }, { shouldPlay: true });
    soundRef.current = sound;
    setIsPlaying(true);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

export const stopAudio = async (soundRef: React.MutableRefObject<Audio.Sound | null>) => {
  if (soundRef.current) {
    await soundRef.current.stopAsync();
    await soundRef.current.unloadAsync();
    soundRef.current = null;
  }
};

export const togglePlayPause = async (
  soundRef: React.MutableRefObject<Audio.Sound | null>,
  isPlaying: boolean,
  setIsPlaying: (isPlaying: boolean) => void
) => {
  if (soundRef.current) {
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  }
};
