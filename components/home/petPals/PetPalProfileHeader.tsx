import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

interface PetPalProfileHeaderProps {
    coverUri?: string;
    avatarUri?: string;
}

const { width } = Dimensions.get('window');

const PetPalProfileHeader = ({ coverUri, avatarUri }: PetPalProfileHeaderProps) => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: coverUri || 'https://images.unsplash.com/photo-1544198305-e0d3423285f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80' }}
                style={styles.coverImage}
            />
            <View style={styles.avatarBorder}>
                <Image
                    source={{ uri: avatarUri || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                    style={styles.avatarImage}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 220,
        width: '100%',
        position: 'relative',
        marginBottom: 30,
    },
    coverImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#E5E7EB',
    },
    avatarBorder: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#FFFFFF',
        padding: 3,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 39,
        backgroundColor: '#F3F4F6',
    },
});

export default PetPalProfileHeader;
