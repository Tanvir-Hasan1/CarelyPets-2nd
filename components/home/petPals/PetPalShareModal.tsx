import { Colors, FontSizes, Spacing } from '@/constants/colors';
import { Copy } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ShareWithUser {
    id: string;
    name: string;
    surname: string;
    image: string;
}

const SHARE_WITH_USERS: ShareWithUser[] = [
    { id: "1", name: "Kesha", surname: "Saha", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60" },
    { id: "2", name: "Darrell", surname: "Steward", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60" },
    { id: "3", name: "Courtney", surname: "Henry", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=60" },
    { id: "4", name: "Theresa", surname: "Webb", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60" },
    { id: "5", name: "Cameron", surname: "Williamson", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60" },
    { id: "6", name: "Kristin", surname: "Watson", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60" },
    { id: "7", name: "D", surname: "L", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60" },
];

interface PetPalShareModalProps {
    visible: boolean;
    onClose: () => void;
    onShare: (text: string) => void;
}

const PetPalShareModal = ({ visible, onClose, onShare }: PetPalShareModalProps) => {
    const [message, setMessage] = useState('');
    const insets = useSafeAreaInsets();

    const handleShare = () => {
        onShare(message);
        setMessage('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.dismissArea} onPress={onClose} />
                <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
                    <View style={styles.handle} />

                    <View style={styles.mainBox}>
                        <View style={styles.userInfo}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60' }}
                                style={styles.currentUserAvatar}
                            />
                            <View>
                                <Text style={styles.currentUserName}>Tuval Smith</Text>
                                <Text style={styles.currentUserHandle}>@tuval</Text>
                            </View>
                        </View>

                        <TextInput
                            style={styles.messageInput}
                            placeholder="Say something"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            value={message}
                            onChangeText={setMessage}
                        />

                        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                            <Text style={styles.shareButtonText}>Share now</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.shareWithSection}>
                        <Text style={styles.sectionTitle}>Share With</Text>
                        <FlatList
                            data={SHARE_WITH_USERS}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.usersList}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.userCard}>
                                    <View style={styles.avatarContainer}>
                                        <Image source={{ uri: item.image }} style={styles.userAvatar} />
                                    </View>
                                    <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.userName} numberOfLines={1}>{item.surname}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    <TouchableOpacity style={styles.copyLinkRow}>
                        <Text style={styles.copyLinkText}>Copy Link</Text>
                        <Copy size={20} color="#006064" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    content: {
        backgroundColor: Colors.lightGray,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: Spacing.md,
    },
    handle: {
        width: 60,
        height: 4,
        backgroundColor: '#4B5563',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    mainBox: {
        backgroundColor: Colors.background,
        borderRadius: 24,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    currentUserAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    currentUserName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    currentUserHandle: {
        fontSize: 14,
        color: '#6B7280',
    },
    messageInput: {
        height: 120,
        backgroundColor: Colors.lightGray,
        borderRadius: Spacing.md,
        padding: Spacing.md,
        fontSize: FontSizes.md,
        color: Colors.text,
        textAlignVertical: 'top',
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    shareButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    shareButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    shareWithSection: {
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: FontSizes.md,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
    },
    usersList: {
        gap: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Spacing.md,
        backgroundColor: Colors.background,
    },
    userCard: {
        alignItems: 'center',
        width: 70,
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        padding: 2,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 8,
    },
    userAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 26,
    },
    userName: {
        fontSize: 12,
        color: '#374151',
        textAlign: 'center',
        fontWeight: '500',
    },
    copyLinkRow: {
        marginTop: Spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.background,
        borderTopColor: 'transparent',
    },
    copyLinkText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
});

export default PetPalShareModal;
