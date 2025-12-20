import CameraIcon from '@/assets/images/icons/Camera.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import FeedItem from '@/components/accounts/profile/FeedItem';
import DeleteModal from '@/components/ui/DeleteModal';
import Header from '@/components/ui/Header';
import ImageSelectionModal from '@/components/ui/ImageSelectionModal';
import { Colors } from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';



export default function ProfileScreen() {
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [imageUpdateMode, setImageUpdateMode] = useState<'avatar' | 'cover' | null>(null);
    const [avatarUri, setAvatarUri] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');
    const [coverUri, setCoverUri] = useState('https://images.unsplash.com/photo-1549488497-1502dc85c4ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80');

    const handleEditProfile = () => {
        router.push('/(tabs)/account/profile/edit');
    };

    const handleCreatePost = () => {
        router.push('/(tabs)/account/profile/create-post');
    };

    const handleEditPost = () => {
        router.push('/(tabs)/account/profile/edit-post');
    };

    const handleDeletePost = (postId: number) => {
        setSelectedPostId(postId);
        setDeleteModalVisible(true);
    };

    const confirmDeletePost = () => {
        // Logic to delete post using selectedPostId
        console.log('Deleting post:', selectedPostId);
        setDeleteModalVisible(false);
        setSelectedPostId(null);
    };

    const handleViewPost = (postId: number) => {
        router.push('/(tabs)/account/profile/view-post');
    };

    const toggleDropdown = (postId: number) => {
        setActiveDropdown(activeDropdown === postId ? null : postId);
    };

    const handleUpdateImage = (mode: 'avatar' | 'cover') => {
        setImageUpdateMode(mode);
        setImageModalVisible(true);
    };

    const pickFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: imageUpdateMode === 'avatar' ? [1, 1] : [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            if (imageUpdateMode === 'avatar') {
                setAvatarUri(result.assets[0].uri);
            } else {
                setCoverUri(result.assets[0].uri);
            }
        }
    };

    const pickFromCamera = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                alert("Camera permission denied");
                return;
            }

            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: imageUpdateMode === 'avatar' ? [1, 1] : [16, 9],
                quality: 1,
            });

            if (!result.canceled) {
                if (imageUpdateMode === 'avatar') {
                    setAvatarUri(result.assets[0].uri);
                } else {
                    setCoverUri(result.assets[0].uri);
                }
            }
        } catch (error) {
            console.error("Error launching camera:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Profile" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Header Container */}
                <View style={styles.headerContainer}>
                    {/* Cover Photo Container */}
                    <View style={styles.coverContainer}>
                        <Image
                            source={{ uri: coverUri }}
                            style={styles.coverPhoto}
                        />
                        <TouchableOpacity
                            style={styles.coverCameraButton}
                            onPress={() => handleUpdateImage('cover')}
                        >
                            <CameraIcon width={28} height={28} />
                        </TouchableOpacity>
                    </View>

                    {/* Overlapping Avatar Container */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: avatarUri }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity
                            style={styles.avatarCameraButton}
                            onPress={() => handleUpdateImage('avatar')}
                        >
                            <CameraIcon width={28} height={28} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* User Info Section */}
                <View style={styles.userInfoSection}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>Sarah John</Text>
                        <TouchableOpacity onPress={handleEditProfile}>
                            <EditIcon width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.location}>Location</Text>
                </View>

                <View style={styles.profileContent}>
                    {/* Stats Buttons */}
                    <View style={styles.statsContainer}>
                        <TouchableOpacity style={[styles.statButton, styles.activeStatButton]}>
                            <Text style={styles.activeStatText}>Posts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.statButton}>
                            <Text style={styles.statText}>Photos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.statButton}>
                            <Text style={styles.statText}>My Pets</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Share Thoughts Input Trigger */}
                    <View style={styles.inputCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                            style={styles.smallAvatar}
                        />
                        <TouchableOpacity
                            style={styles.inputPlaceholder}
                            onPress={handleCreatePost}
                        >
                            <Text style={styles.inputText}>Share your pet thougts</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Feed Item 1 */}
                    <FeedItem
                        postId={1}
                        userAvatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        userName="Sarah John"
                        actionText="updated her profile picture"
                        timeAgo="1h ago"
                        contentImage="https://images.unsplash.com/photo-1518331483807-f639071f3dd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        likesCount="1.2 K"
                        commentsCount="1.2 K"
                        isDropdownVisible={activeDropdown === 1}
                        onToggleDropdown={() => toggleDropdown(1)}
                        onCloseDropdown={() => setActiveDropdown(null)}
                        onEditPost={handleEditPost}
                        onDeletePost={() => handleDeletePost(1)}
                        onPress={() => handleViewPost(1)}
                    />

                    {/* Feed Item 2 */}
                    <FeedItem
                        postId={2}
                        userAvatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        userName="Sarah John"
                        actionText="updated her cover photo"
                        timeAgo="1h ago"
                        contentImage="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        likesCount="1.2 K"
                        commentsCount="1.2 K"
                        isDropdownVisible={activeDropdown === 2}
                        onToggleDropdown={() => toggleDropdown(2)}
                        onCloseDropdown={() => setActiveDropdown(null)}
                        onEditPost={handleEditPost}
                        onDeletePost={() => handleDeletePost(2)}
                        onPress={() => handleViewPost(2)}
                    />
                </View>
            </ScrollView>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={confirmDeletePost}
            />

            <ImageSelectionModal
                visible={imageModalVisible}
                onClose={() => setImageModalVisible(false)}
                onCamera={pickFromCamera}
                onGallery={pickFromGallery}
                title={imageUpdateMode === 'cover' ? "Update Cover Photo" : "Update Profile Photo"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerContainer: {
        position: 'relative',
        height: 230,
        backgroundColor: '#F9FAFB',
    },
    coverContainer: {
        position: 'relative',
        width: '100%',
        height: 180,
    },
    coverPhoto: {
        backgroundColor: Colors.success,
        width: '100%',
        height: '100%',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        zIndex: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    avatarCameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    coverCameraButton: {
        position: 'absolute',
        bottom: -14,
        right: 12,
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    userInfoSection: {
        paddingHorizontal: 20,
        marginTop: 10,
        paddingBottom: 16,
    },
    profileContent: {
        paddingHorizontal: 20,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginRight: 8,
    },
    location: {
        fontSize: 14,
        color: '#0B3C5D',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    activeStatButton: {
        backgroundColor: '#A0E7E5',
        borderColor: '#A0E7E5',
    },
    statText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    activeStatText: {
        fontSize: 14,
        color: '#004D40',
        fontWeight: '600',
    },
    inputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    smallAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    inputPlaceholder: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    inputText: {
        color: '#6B7280',
        fontSize: 14,
    },

});
