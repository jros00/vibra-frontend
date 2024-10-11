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
  
export const playSong = async (audio_url: string, isSoundLoading: React.MutableRefObject<boolean>, soundRef: React.MutableRefObject<Audio.Sound | null>, setIsPlaying: (playing: boolean) => void, position: number = 0) => {
    if (isSoundLoading.current) {
    console.info('Song loading is already in progress.');
    return;
    }
    isSoundLoading.current = true;

    if (soundRef.current) {
    try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
    } catch (error) {
        console.error('Error stopping sound:', error);
    }
    }

    soundRef.current = null;
    try {
    const { sound } = await Audio.Sound.createAsync(
        { uri: audio_url },
        { shouldPlay: true, positionMillis: position }
    );
    soundRef.current = sound;
    console.info(`Playing song from position ${position}`);
    } catch (error) {
    console.error('Error playing sound:', error);
    }

    isSoundLoading.current = false;
};
  
export const stopAudio = async (soundRef: React.MutableRefObject<Audio.Sound | null>) => {
    if (soundRef.current) {
        try {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
        } catch (error) {
            console.error('Error stopping audio:', error);
        }
    }
};

export const togglePlayPause = async (soundRef: React.MutableRefObject<Audio.Sound | null>, isPlaying: boolean, setIsPlaying: (playing: boolean) => void) => {
    if (soundRef.current) {
        if (isPlaying) {
            await soundRef.current.pauseAsync();
        } else {
        await soundRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
    }
};