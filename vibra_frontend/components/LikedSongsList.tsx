import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useThemeColor } from '@/components/Themed';
import TrackItem from './TrackItem';
import { useUser } from '@/hooks/useUser';

const LikedSongsList = () => {
    const { profile } = useUser();
    const songs = profile?.liked_tracks;
    const backgroundColor = useThemeColor({}, 'background');

    return (
        <FlatList
            data={songs}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            renderItem={({ item }) => (
                <TrackItem
                    title={item.track_title}
                    artist={item.artist_name}
                    coverArt={item.album_image}
                />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={[styles.list, { backgroundColor }]} // Set background color directly
        />
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1, // Ensures FlatList takes up the remaining available space
        paddingHorizontal: 20,
    },
});

export default LikedSongsList;
