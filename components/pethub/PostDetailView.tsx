import PostOptionsDropdown from '@/components/accounts/profile/PostOptionsDropdown';
import DeleteModal from '@/components/ui/DeleteModal';
import Header from '@/components/ui/Header';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Heart, MessageCircle, MoreVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PostDetailView = () => {
    const router = useRouter();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const handleEditPost = () => {
        setDropdownVisible(false);
        // This might need adjustment based on where it's called from
        router.push('/(tabs)/account/profile/edit-post');
    };

    const handleDeletePost = () => {
        setDropdownVisible(false);
        setDeleteModalVisible(true);
    };

    const confirmDeletePost = () => {
        console.log('Deleting post...');
        setDeleteModalVisible(false);
        router.back();
    };

    return (
        <View style={styles.container}>
            <Header title="View Post" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.postCard}>
                    {/* Header: User Info */}
                    <View style={styles.postHeader}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                            style={styles.avatar}
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>Sarah John</Text>
                            <Text style={styles.timeAgo}>1h ago</Text>
                        </View>
                        <View style={styles.moreContainer}>
                            <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                                <MoreVertical size={20} color="#6B7280" />
                            </TouchableOpacity>
                            <PostOptionsDropdown
                                visible={dropdownVisible}
                                onClose={() => setDropdownVisible(false)}
                                onEdit={handleEditPost}
                                onDelete={handleDeletePost}
                            />
                        </View>
                    </View>

                    {/* Content: Text */}
                    <View style={styles.contentContainer}>
                        <Text style={styles.postText}>
                            A heart with a paw inside could represent love for pets and the community aspect.{'\n\n'}
                            A heart with a paw inside could represent love for pets and the community aspect.{'\n'}
                            A heart with a paw inside could represent love for pets and the community aspect.{'\n'}
                            A heart with a paw inside could represent love for pets and the community aspect.{'\n\n'}
                            A heart with a paw inside could represent love for pets and the community aspect.
                        </Text>
                    </View>

                    {/* Content: Image */}
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1518331483807-f639071f3dd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                        style={styles.postImage}
                    />

                    {/* Footer: Actions */}
                    <View style={styles.postFooter}>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Heart size={20} color={Colors.primary} />
                                <Text style={styles.statText}>1.2 K</Text>
                            </View>
                            <View style={styles.statItem}>
                                <MessageCircle size={20} color="#666" />
                                <Text style={styles.statText}>1.2 K</Text>
                            </View>
                        </View>
                        <Text style={styles.sharesText}>33 shares</Text>
                    </View>
                </View>
            </ScrollView>

            <DeleteModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={confirmDeletePost}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 80,
    },
    postCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    timeAgo: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    moreContainer: {
        position: 'relative',
    },
    contentContainer: {
        marginBottom: 16,
    },
    postText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    postImage: {
        width: '100%',
        height: 400,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#F3F4F6',
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        color: '#4B5563',
    },
    sharesText: {
        fontSize: 14,
        color: '#6B7280',
    },
});

export default PostDetailView;
