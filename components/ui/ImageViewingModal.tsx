import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ImageViewingModalProps {
    visible: boolean;
    imageUri: string | null;
    onClose: () => void;
}

const ImageViewingModal = ({ visible, imageUri, onClose }: ImageViewingModalProps) => {
    const insets = useSafeAreaInsets();

    if (!imageUri) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.closeButton, { top: insets.top + 16 }]}
                    onPress={onClose}
                >
                    <HugeiconsIcon icon={Cancel01Icon} size={32} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        zIndex: 1,
        padding: 8,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default ImageViewingModal;
