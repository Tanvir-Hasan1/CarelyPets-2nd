import MessageIcon from '@/assets/images/icons/message.svg';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PetPalInfoProps {
    name: string;
    location: string;
    onMessagePress?: () => void;
}

const PetPalInfo = ({ name, location, onMessagePress }: PetPalInfoProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.location}>{location}</Text>
            </View>
            <TouchableOpacity
                style={styles.messageButton}
                onPress={onMessagePress}
                activeOpacity={0.7}
            >
                <MessageIcon width={50} height={50} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#004D40',
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: '#607D8B',
    },
    messageButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#B2EBF2',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PetPalInfo;
