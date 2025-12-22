import ShareIcon from '@/assets/images/icons/share.svg';
import { Colors } from '@/constants/colors';
import { Heart, MessageCircle, MoreVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PetPalBlockModal from '../../home/petPals/PetPalBlockModal';
import PetPalPostDropdown from '../../home/petPals/PetPalPostDropdown';
import PetPalReportModal from '../../home/petPals/PetPalReportModal';
import PetPalShareModal from '../../home/petPals/PetPalShareModal';
import PetPalWriteReportModal from '../../home/petPals/PetPalWriteReportModal';

interface FeedItemProps {
    postId: number;
    userAvatar: string;
    userName: string;
    actionText: string;
    timeAgo: string;
    contentImage: string;
    likesCount: string;
    commentsCount: string;
    sharesCount?: string;
    isDropdownVisible: boolean;
    onToggleDropdown: () => void;
    onCloseDropdown: () => void;
    onEditPost: () => void;
    onDeletePost: () => void;
    onPress?: () => void;
}

const FeedItem = ({
    postId,
    userAvatar,
    userName,
    actionText,
    timeAgo,
    contentImage,
    likesCount,
    commentsCount,
    sharesCount,
    isDropdownVisible,
    onToggleDropdown,
    onCloseDropdown,
    onEditPost,
    onDeletePost,
    onPress,
}: FeedItemProps) => {
    const [showReportModal, setShowReportModal] = useState(false);
    const [showWriteReportModal, setShowWriteReportModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={styles.feedItem}
        >
            <View style={styles.feedHeader}>
                <Image
                    source={{ uri: userAvatar }}
                    style={styles.feedAvatar}
                />
                <View style={styles.feedMeta}>
                    <Text style={styles.feedUserText}>
                        <Text style={styles.feedUserName}>{userName}</Text> {actionText}
                    </Text>
                    <Text style={styles.feedTime}>{timeAgo}</Text>
                </View>
                <View style={{ position: 'relative' }}>
                    <TouchableOpacity onPress={onToggleDropdown}>
                        <MoreVertical size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <PetPalPostDropdown
                        visible={isDropdownVisible}
                        onClose={onCloseDropdown}
                        onReport={() => setShowReportModal(true)}
                        onBlock={() => setShowBlockModal(true)}
                    />
                </View>
            </View>

            <Image
                source={{ uri: contentImage }}
                style={styles.feedImage}
            />

            <View style={styles.feedActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Heart size={20} color={Colors.primary} />
                    <Text style={styles.actionText}>{likesCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={20} color="#666" />
                    <Text style={styles.actionText}>{commentsCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setShowShareModal(true)}
                >
                    <ShareIcon width={20} height={20} color="#666" />
                    <Text style={styles.actionText}>{sharesCount || '0'}</Text>
                </TouchableOpacity>
            </View>

            <PetPalReportModal
                visible={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSelectOther={() => {
                    setShowReportModal(false);
                    setShowWriteReportModal(true);
                }}
            />

            <PetPalWriteReportModal
                visible={showWriteReportModal}
                onClose={() => setShowWriteReportModal(false)}
                onSend={(text) => {
                    console.log('Report sent:', text);
                    setShowWriteReportModal(false);
                }}
            />

            <PetPalBlockModal
                visible={showBlockModal}
                onClose={() => setShowBlockModal(false)}
                onConfirm={() => {
                    console.log('User blocked');
                    setShowBlockModal(false);
                }}
            />

            <PetPalShareModal
                visible={showShareModal}
                onClose={() => setShowShareModal(false)}
                onShare={(text) => {
                    console.log('Post shared with message:', text);
                    setShowShareModal(false);
                }}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    feedItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    feedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    feedAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    feedMeta: {
        flex: 1,
    },
    feedUserText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    feedUserName: {
        fontWeight: 'bold',
        color: '#111827',
    },
    feedTime: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    feedImage: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        marginBottom: 12,
    },
    feedActions: {
        flexDirection: 'row',
        gap: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        color: '#4B5563',
    },
});

export default FeedItem;
