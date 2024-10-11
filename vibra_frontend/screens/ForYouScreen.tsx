import { FlatList, Dimensions, View as RNView, TouchableOpacity } from 'react-native';
import SongCard from '@/components/SongCard';
import NowPlayingBar from '@/components/NowPlayingBar';
import PreferenceButton from '@/components/PreferenceButton';
import ShareButton from '@/components/ShareButton';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { enableAudio } from '@/services/AudioService';
import { styles } from './styles';
import { useSongFeed } from '@/hooks/useSongFeed';
import { useTrackTime } from '@/hooks/useTrackTime';

const { height } = Dimensions.get('window');

export default function ForYouScreen() {
  const { songFeed, currentSong, isPlaying, handleTogglePlayPause, onViewableItemsChanged, cardHeight, onCardLayout, conversations } = useSongFeed();
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  
  useTrackTime(isPlaying, currentSong);
  

  useEffect(() => {
    enableAudio();
  }, []);


  return (
    <RNView style={{ flex: 1 }}>
      <FlatList
        data={songFeed}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleTogglePlayPause()} onLayout={onCardLayout}>
            <SongCard 
            image={{ uri: item.album_image }} 
            palette={item.album_image_palette} 
            dominantColor={item.album_image_dominant_color} 
            />
          </TouchableOpacity>
        )}
        pagingEnabled={Platform.OS !== 'web'}
        showsVerticalScrollIndicator={false}
        snapToAlignment={Platform.OS !== 'web' ? 'start' : undefined}
        snapToInterval={Platform.OS !== 'web' ? cardHeight : undefined}
        decelerationRate={Platform.OS !== 'web' ? 'fast' : undefined}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        overScrollMode="never"
      />

      <RNView style={styles.buttonContainer}>
        {currentSong && (
          <>
            <PreferenceButton preference="like" track_id={currentSong.track_id} />
            <PreferenceButton preference="dislike" track_id={currentSong.track_id} />
            <ShareButton track_id={currentSong.track_id} conversations={conversations} />
          </>
        )}
      </RNView>

      {currentSong && (
        <NowPlayingBar
          title={currentSong.track_title}
          artist={currentSong.artist_name}
        />
      )}
    </RNView>
  );
}