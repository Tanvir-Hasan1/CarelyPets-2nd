import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import PetPalImageModal from './PetPalImageModal';

interface PhotoData {
    uri: string;
    userName: string;
    dateText: string;
    caption: string;
    likesCount: string;
    commentsCount: string;
    sharesCount: string;
}

interface PetPalPhotoGridProps {
    photos: PhotoData[];
}

import { Spacing } from '@/constants/colors';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = Math.floor((width - (Spacing.lg * 2) - 20) / 3); // Spacing.lg * 2 is total horizontal padding, 20 is total gap

const PetPalPhotoGrid = ({ photos }: PetPalPhotoGridProps) => {
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);

    return (
        <View style={styles.container}>
            {photos.map((photo, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedPhoto(photo)}
                >
                    <Image
                        source={{ uri: photo.uri }}
                        style={styles.photo}
                    />
                </TouchableOpacity>
            ))}

            {selectedPhoto && (
                <PetPalImageModal
                    visible={!!selectedPhoto}
                    onClose={() => setSelectedPhoto(null)}
                    imageUri={selectedPhoto.uri}
                    userName={selectedPhoto.userName}
                    dateText={selectedPhoto.dateText}
                    caption={selectedPhoto.caption}
                    likesCount={selectedPhoto.likesCount}
                    commentsCount={selectedPhoto.commentsCount}
                    sharesCount={selectedPhoto.sharesCount}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    photo: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
});

export default PetPalPhotoGrid;
