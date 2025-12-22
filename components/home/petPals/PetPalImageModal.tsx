import { Heart, MessageCircle, Share2, X } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PetPalImageModalProps {
    visible: boolean;
    onClose: () => void;
    imageUri: string;
    userName: string;
    dateText: string;
    caption: string;
    likesCount: string;
    commentsCount: string;
    sharesCount: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PetPalImageModal = ({
    visible,
    onClose,
    imageUri,
    userName,
    dateText,
    caption,
    likesCount,
    commentsCount,
    sharesCount,
}: PetPalImageModalProps) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Close Button */}
                <TouchableOpacity
                    style={[styles.closeButton, { top: insets.top + 10 }]}
                    onPress={onClose}
                >
                    <X size={28} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Main Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Bottom Info Section */}
                <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.dateText}>{dateText}</Text>
                    <Text style={styles.caption}>{caption}</Text>

                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.actionItem}>
                            <Heart size={20} color="#00BCD4" />
                            <Text style={styles.actionText}>{likesCount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem}>
                            <MessageCircle size={20} color="#FFFFFF" />
                            <Text style={styles.actionText}>{commentsCount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem}>
                            <Share2 size={20} color="#FFFFFF" />
                            <Text style={styles.actionText}>{sharesCount}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    closeButton: {
        position: 'absolute',
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.6,
    },
    bottomSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        color: '#999999',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    caption: {
        fontSize: 15,
        color: '#FFFFFF',
        lineHeight: 22,
        marginBottom: 24,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },
});

export default PetPalImageModal;
