import DeleteModal from '@/components/ui/DeleteModal';
import Header from '@/components/ui/Header';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import {
    Camera,
    Edit2,
    Edit3,
    Heart,
    MessageCircle,
    MoreVertical,
    Trash2
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Post Options Dropdown Component
const PostOptionsDropdown = ({
    visible,
    onClose,
    onEdit,
    onDelete
}: {
    visible: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) => {
    if (!visible) return null;

    return (
        <View style={dropdownStyles.container}>
            <TouchableOpacity
                style={dropdownStyles.option}
                onPress={() => {
                    onClose();
                    onDelete();
                }}
            >
                <Trash2 size={18} color="#EF4444" />
                <Text style={dropdownStyles.deleteText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={dropdownStyles.option}
                onPress={() => {
                    onClose();
                    onEdit();
                }}
            >
                <Edit3 size={18} color={Colors.primary} />
                <Text style={dropdownStyles.editText}>Edit</Text>
            </TouchableOpacity>
        </View>
    );
};

const dropdownStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 30,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 100,
        minWidth: 120,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        gap: 10,
    },
    deleteText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#EF4444',
    },
    editText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.primary,
    },
});

export default function ProfileScreen() {
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

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

    const toggleDropdown = (postId: number) => {
        setActiveDropdown(activeDropdown === postId ? null : postId);
    };

    return (
        <View style={styles.container}>
            <Header title="Profile" style={styles.header} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Cover Photo */}
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1549488497-1502dc85c4ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
                    style={styles.coverPhoto}
                />

                <View style={styles.profileContent}>
                    {/* Header Info */}
                    <View style={styles.headerInfo}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                                style={styles.avatar}
                            />
                            <View style={styles.cameraIconBadge}>
                                <Camera size={14} color="#555" />
                            </View>
                        </View>

                        <View style={styles.nameRow}>
                            <Text style={styles.name}>Sarah John</Text>
                            <TouchableOpacity onPress={handleEditProfile}>
                                <Edit2 size={20} color={Colors.primary} style={styles.editIcon} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.location}>Location</Text>
                    </View>

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
                    <View style={styles.feedItem}>
                        <View style={styles.feedHeader}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                                style={styles.feedAvatar}
                            />
                            <View style={styles.feedMeta}>
                                <Text style={styles.feedUserText}>
                                    <Text style={styles.feedUserName}>Sarah John</Text> updated her profile picture
                                </Text>
                                <Text style={styles.feedTime}>1h ago</Text>
                            </View>
                            <View style={{ position: 'relative' }}>
                                <TouchableOpacity onPress={() => toggleDropdown(1)}>
                                    <MoreVertical size={20} color="#6B7280" />
                                </TouchableOpacity>
                                <PostOptionsDropdown
                                    visible={activeDropdown === 1}
                                    onClose={() => setActiveDropdown(null)}
                                    onEdit={handleEditPost}
                                    onDelete={() => handleDeletePost(1)}
                                />
                            </View>
                        </View>

                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1518331483807-f639071f3dd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                            style={styles.feedImage}
                        />

                        <View style={styles.feedActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Heart size={20} color={Colors.primary} />
                                <Text style={styles.actionText}>1.2 K</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <MessageCircle size={20} color="#666" />
                                <Text style={styles.actionText}>1.2 K</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Feed Item 2 */}
                    <View style={styles.feedItem}>
                        <View style={styles.feedHeader}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                                style={styles.feedAvatar}
                            />
                            <View style={styles.feedMeta}>
                                <Text style={styles.feedUserText}>
                                    <Text style={styles.feedUserName}>Sarah John</Text> updated her cover photo
                                </Text>
                                <Text style={styles.feedTime}>1h ago</Text>
                            </View>
                            <View style={{ position: 'relative' }}>
                                <TouchableOpacity onPress={() => toggleDropdown(2)}>
                                    <MoreVertical size={20} color="#6B7280" />
                                </TouchableOpacity>
                                <PostOptionsDropdown
                                    visible={activeDropdown === 2}
                                    onClose={() => setActiveDropdown(null)}
                                    onEdit={handleEditPost}
                                    onDelete={() => handleDeletePost(2)}
                                />
                            </View>
                        </View>

                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                            style={styles.feedImage}
                        />

                        <View style={styles.feedActions}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Heart size={20} color={Colors.primary} />
                                <Text style={styles.actionText}>1.2 K</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <MessageCircle size={20} color="#666" />
                                <Text style={styles.actionText}>1.2 K</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={confirmDeletePost}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: '#FFFFFF',
    },
    coverPhoto: {
        width: '100%',
        height: 180,
    },
    profileContent: {
        marginTop: -50,
        paddingHorizontal: 20,
    },
    headerInfo: {
        marginBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    cameraIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        padding: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
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
    editIcon: {
        marginTop: 4,
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
