import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { Participant } from '@/types/Participant';
import { View, Text } from './Themed';

interface LikedByItemProps {
    liked_by: Participant;
}

const width = Dimensions.get('window').width;

const LikedByItem: React.FC<LikedByItemProps> = ({liked_by}) => {
    return (
        <View style={ styles.container }>
            <Text style={ styles.text }>This song was recommended to you by </Text>
            <View style={styles.userContainer}>
                <Image source={{ uri: liked_by.profile_picture }} style={ styles.profilePicture }/>
                <Text style={ styles.profileText }>{liked_by.username}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
        flexDirection: 'column',
        alignItems: 'center', 
        backgroundColor: 'transparent',
        width: width,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        backgroundColor: 'transparent',
    },
    text: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#fff',
        marginRight: 5,
    },
    profileText: {
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 10,
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 15,
        margin: 10,
    },
});

export default LikedByItem;