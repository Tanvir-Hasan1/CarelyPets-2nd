import CameraIcon from '@/assets/images/icons/Camera.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import FeedItem from '@/components/accounts/profile/FeedItem';
import PetPalPetList from '@/components/home/petPals/PetPalPetList';
import PetPalPhotoGrid from '@/components/home/petPals/PetPalPhotoGrid';
import ShareThoughtsCard from '@/components/pethub/ShareThoughtsCard';
import CommentModal from '@/components/ui/CommentModal';
import DeleteModal from '@/components/ui/DeleteModal';
import Header from '@/components/ui/Header';
import ImageSelectionModal from '@/components/ui/ImageSelectionModal';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/colors';
import { useAuthStore } from '@/store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const MOCK_PHOTOS = [
    {
        uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop',
        userName: 'Tanvir Hasan',
        dateText: 'MON AT 6:06 PM',
        caption: 'He is very diligent pet, save you whatever the situation',
        likesCount: '1.2 K',
        commentsCount: '1.2 K',
        sharesCount: '1.2 K'
    },
    {
        uri: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop',
        userName: 'Tanvir Hasan',
        dateText: 'TUE AT 2:15 PM',
        caption: 'Playtime at the park is always the best part of the day!',
        likesCount: '850',
        commentsCount: '45',
        sharesCount: '12'
    },
    {
        uri: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&auto=format&fit=crop',
        userName: 'Tanvir Hasan',
        dateText: 'WED AT 10:30 AM',
        caption: 'Someone is waiting for treats...',
        likesCount: '2.1 K',
        commentsCount: '156',
        sharesCount: '89'
    },
    {
        uri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&auto=format&fit=crop',
        userName: 'Tanvir Hasan',
        dateText: 'THU AT 4:00 PM',
        caption: 'Nap time sequence initiated.',
        likesCount: '1.5 K',
        commentsCount: '92',
        sharesCount: '34'
    },
    {
        uri: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&auto=format&fit=crop',
        userName: 'Tanvir Hasan',
        dateText: 'FRI AT 8:20 PM',
        caption: 'Gazing at the sunset with my best pal.',
        likesCount: '3.2 K',
        commentsCount: '245',
        sharesCount: '120'
    },
];

const MOCK_PETS = [
    { id: 'p1', name: 'Buddy', gender: 'Female' as const, breed: 'Persian Cat', age: '2 years old', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop' },
    { id: 'p2', name: 'Max', gender: 'Male' as const, breed: 'Golden Retriever', age: '3 years old', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop' },
    { id: 'p3', name: 'Luna', gender: 'Female' as const, breed: 'Siamese Cat', age: '1 year old', image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&auto=format&fit=crop' },
];

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'Posts' | 'Photos' | 'My Pets'>('Posts');

    const handleCommentPress = (post: any) => {
        setSelectedPost(post);
        setCommentModalVisible(true);
    };
    const [imageUpdateMode, setImageUpdateMode] = useState<'avatar' | 'cover' | null>(null);
    const [avatarUri, setAvatarUri] = useState(user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');
    const [coverUri, setCoverUri] = useState('https://images.unsplash.com/photo-1549488497-1502dc85c4ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80');

    useEffect(() => {
        if (user?.avatarUrl) {
            setAvatarUri(user.avatarUrl);
        }
    }, [user?.avatarUrl]);

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
                        <Text style={styles.name}>{user?.name || 'User'}</Text>
                        <TouchableOpacity onPress={handleEditProfile}>
                            <EditIcon width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.username}>@{user?.username || 'username'}</Text>
                    <Text style={styles.location}>{user?.address || user?.country || user?.location?.country || 'No location set'}</Text>
                </View>

                {/* Tabs Section */}
                <View style={styles.profileContent}>
                    <View style={styles.statsContainer}>
                        {(['Posts', 'Photos', 'My Pets'] as const).map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.statButton,
                                    activeTab === tab && styles.activeStatButton
                                ]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[
                                    styles.statText,
                                    activeTab === tab && styles.activeStatText
                                ]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Content Section */}
                    {activeTab === 'Posts' ? (
                        <>
                            {/* Share Thoughts Card */}
                            <ShareThoughtsCard
                                avatarUrl={avatarUri}
                                onPress={handleCreatePost}
                                onGallery={async () => {
                                    let result = await ImagePicker.launchImageLibraryAsync({
                                        mediaTypes: ['images'],
                                        allowsMultipleSelection: true,
                                        quality: 1,
                                    });

                                    if (!result.canceled) {
                                        const selectedImages = result.assets.map(asset => asset.uri);
                                        router.push({
                                            pathname: "/(tabs)/account/profile/create-post",
                                            params: { initialImages: JSON.stringify(selectedImages) }
                                        });
                                    }
                                }}
                                onCamera={async () => {
                                    let result = await ImagePicker.launchCameraAsync({
                                        mediaTypes: ['images'],
                                        quality: 1,
                                    });

                                    if (!result.canceled) {
                                        const selectedImages = [result.assets[0].uri];
                                        router.push({
                                            pathname: "/(tabs)/account/profile/create-post",
                                            params: { initialImages: JSON.stringify(selectedImages) }
                                        });
                                    }
                                }}
                            />

                            {/* Feed Item 1 */}
                            <FeedItem
                                postId={1}
                                userAvatar={avatarUri}
                                userName={user?.name || "User"}
                                actionText="updated her profile picture"
                                timeAgo="1h ago"
                                contentImage="https://images.unsplash.com/photo-1518331483807-f639071f3dd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                likesCount="1.2 K"
                                commentsCount="1.2 K"
                                sharesCount="33"
                                isDropdownVisible={activeDropdown === 1}
                                onToggleDropdown={() => toggleDropdown(1)}
                                onCloseDropdown={() => setActiveDropdown(null)}
                                onEditPost={handleEditPost}
                                onDeletePost={() => handleDeletePost(1)}
                                onPress={() => handleViewPost(1)}
                                onCommentPress={() => handleCommentPress({ id: 1, likesCount: "1.2 K", sharesCount: "33" })}
                            />

                            {/* Feed Item 2 */}
                            <FeedItem
                                postId={2}
                                userAvatar={avatarUri}
                                userName={user?.name || "User"}
                                actionText="posted a photo"
                                timeAgo="2h ago"
                                contentImage="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                likesCount="1.2 K"
                                commentsCount="1.2 K"
                                sharesCount="12"
                                isDropdownVisible={activeDropdown === 2}
                                onToggleDropdown={() => toggleDropdown(2)}
                                onCloseDropdown={() => setActiveDropdown(null)}
                                onEditPost={handleEditPost}
                                onDeletePost={() => handleDeletePost(2)}
                                onPress={() => handleViewPost(2)}
                                onCommentPress={() => handleCommentPress({ id: 2, likesCount: "1.2 K", sharesCount: "12" })}
                            />
                        </>
                    ) : activeTab === 'Photos' ? (
                        <PetPalPhotoGrid photos={MOCK_PHOTOS} />
                    ) : (
                        <PetPalPetList pets={MOCK_PETS} />
                    )}
                </View>

                {selectedPost && (
                    <CommentModal
                        visible={commentModalVisible}
                        onClose={() => setCommentModalVisible(false)}
                        postId={selectedPost.id}
                        likesCount={selectedPost.likesCount}
                        sharesCount={selectedPost.sharesCount}
                    />
                )}
            </ScrollView>

            <ImageSelectionModal
                visible={imageModalVisible}
                onClose={() => setImageModalVisible(false)}
                onGallery={() => {
                    pickFromGallery();
                    setImageModalVisible(false);
                }}
                onCamera={() => {
                    pickFromCamera();
                    setImageModalVisible(false);
                }}
            />

            <DeleteModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={confirmDeletePost}
                title="Delete Post"
                description="Are you sure you want to delete this post? This action cannot be undone."
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerContainer: {
        position: 'relative',
        height: 260,
        backgroundColor: Colors.background,
    },
    coverContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    coverPhoto: {
        width: '100%',
        height: '100%',
        backgroundColor: 'red',
    },
    coverCameraButton: {
        position: 'absolute',
        right: Spacing.md,
        bottom: -18,
        backgroundColor: 'transparent',
        width: 35,
        height: 35,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: 0,
        left: Spacing.lg,
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: Colors.background,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    avatarCameraButton: {
        position: 'absolute',
        right: -4,
        bottom: 0,
        backgroundColor: 'transparent',
        width: 35,
        height: 35,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfoSection: {
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.md,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: 2,
    },
    name: {
        fontSize: FontSizes.xxl,
        fontWeight: FontWeights.bold,
        color: Colors.text,
    },
    username: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    location: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
    },
    profileContent: {
        paddingHorizontal: Spacing.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginVertical: Spacing.lg,
    },
    statButton: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    activeStatButton: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    statText: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
    },
    activeStatText: {
        fontSize: FontSizes.sm,
        color: Colors.background,
        fontWeight: FontWeights.semibold,
    },
    inputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.md,
        borderRadius: 16,
        marginBottom: Spacing.xl,
    },
    smallAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: Spacing.md,
    },
    inputPlaceholder: {
        flex: 1,
        backgroundColor: Colors.lightGray,
    },
    inputText: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
    },
});
