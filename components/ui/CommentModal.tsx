import SendIcon from '@/assets/images/icons/send.svg';
import { Colors } from '@/constants/colors';
import { Heart, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Comment {
    id: number;
    userAvatar: string;
    userName: string;
    content: string;
    time: string;
    likes: string;
    replies?: Comment[];
}

interface CommentModalProps {
    visible: boolean;
    onClose: () => void;
    postId: number;
    likesCount: string;
    sharesCount: string;
}

const MOCK_COMMENTS: Comment[] = [
    {
        id: 1,
        userAvatar: 'https://i.pravatar.cc/150?u=delray',
        userName: 'Del Ray',
        content: 'Really a cute cat, and the lady raise them quite good',
        time: '5h',
        likes: '12',
    },
    {
        id: 2,
        userAvatar: 'https://i.pravatar.cc/150?u=somia',
        userName: 'Somia Kasem',
        content: 'Really a cute cat, and the lady raise them quite good',
        time: '5h',
        likes: '5K',
        replies: [
            {
                id: 3,
                userAvatar: 'https://i.pravatar.cc/150?u=kasem',
                userName: 'Kasem Khondokar',
                content: 'Really a cute cat, and the lady raise them quite good',
                time: '5h',
                likes: '5K',
            },
            {
                id: 4,
                userAvatar: 'https://i.pravatar.cc/150?u=yasin',
                userName: 'Yasin Kasem',
                content: 'Really a cute cat, and the lady raise them quite good',
                time: '5h',
                likes: '5K',
            }
        ]
    }
];

const CommentItem = ({ comment, isReply = false, onReply }: { comment: Comment; isReply?: boolean; onReply: (comment: Comment) => void }) => {
    return (
        <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
            <View style={styles.commentHeader}>
                <Image source={{ uri: comment.userAvatar }} style={isReply ? styles.replyAvatar : styles.commentAvatar} />
                <View style={styles.commentContent}>
                    <View style={styles.commentBubble}>
                        <Text style={styles.commentUserName}>{comment.userName}</Text>
                        <Text style={styles.commentText}>{comment.content}</Text>
                    </View>
                    <View style={styles.commentActions}>
                        <Text style={styles.actionText}>{comment.time}</Text>
                        <TouchableOpacity>
                            <Text style={[styles.actionText, styles.highlightText]}>{comment.likes} Like</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onReply(comment)}>
                            <Text style={styles.actionText}>Reply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {comment.replies && comment.replies.length > 0 && (
                <View style={styles.repliesList}>
                    <View style={styles.replyLine} />
                    {comment.replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} isReply onReply={onReply} />
                    ))}
                </View>
            )}
        </View>
    );
};


const CommentModal = ({ visible, onClose, postId, likesCount, sharesCount }: CommentModalProps) => {
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

    const handleReply = (comment: Comment) => {
        setReplyingTo(comment);
    };

    const handleSend = () => {
        if (!newComment.trim()) return;

        const commentData: Comment = {
            id: Date.now(),
            userAvatar: 'https://i.pravatar.cc/150?u=me',
            userName: 'Tuval Smith',
            content: newComment,
            time: 'Just now',
            likes: '0',
        };

        if (replyingTo) {
            // Find parent and add reply
            const updatedComments = comments.map(c => {
                if (c.id === replyingTo.id) {
                    return { ...c, replies: [...(c.replies || []), commentData] };
                }
                // Check in replies (only 1 level deep for mock)
                if (c.replies?.some(r => r.id === replyingTo.id)) {
                    return { ...c, replies: [...(c.replies || []), commentData] };
                }
                return c;
            });
            setComments(updatedComments);
            setReplyingTo(null);
        } else {
            setComments([commentData, ...comments]);
        }
        setNewComment("");
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={onClose}
                style={styles.modalOverlay}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalContent}
                >
                    <View style={styles.headerHandle} />

                    <View style={styles.statsRow}>
                        <View style={styles.statGroup}>
                            <Heart size={20} color={Colors.primary} fill={Colors.primary} />
                            <Text style={styles.statCount}>{likesCount}</Text>
                        </View>
                        <Text style={styles.shareCount}>{sharesCount} shares</Text>
                    </View>

                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <CommentItem comment={item} onReply={handleReply} />}
                        contentContainerStyle={styles.commentsList}
                        showsVerticalScrollIndicator={false}
                    />

                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                    >
                        {replyingTo && (
                            <View style={styles.replyingIndicator}>
                                <Text style={styles.replyingToText}>Replying to {replyingTo.userName}</Text>
                                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                                    <X size={16} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={styles.inputArea}>
                            <TextInput
                                style={styles.input}
                                placeholder={replyingTo ? "Add Reply" : "Add Comment"}
                                placeholderTextColor="#9CA3AF"
                                value={newComment}
                                onChangeText={setNewComment}
                            />
                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={handleSend}
                            >
                                <SendIcon width={50} height={50} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '80%',
        paddingTop: 12,
    },
    headerHandle: {
        width: 60,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    statGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statCount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    shareCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    commentsList: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    commentContainer: {
        marginBottom: 24,
    },
    replyContainer: {
        marginTop: 16,
    },
    commentHeader: {
        flexDirection: 'row',
        gap: 12,
    },
    commentAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    replyAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    commentContent: {
        flex: 1,
    },
    commentBubble: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
    },
    commentUserName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    commentActions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
        paddingLeft: 4,
    },
    actionText: {
        fontSize: 12,
        color: '#6B7280',
    },
    highlightText: {
        color: Colors.secondary, // Or a color that matches "5K Like"
        fontWeight: '600',
    },
    repliesList: {
        paddingLeft: 22,
        position: 'relative',
    },
    replyLine: {
        position: 'absolute',
        left: 0,
        top: -10,
        bottom: 20,
        width: 2,
        backgroundColor: '#E5E7EB',
        borderBottomLeftRadius: 10,
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
        gap: 12,
    },
    input: {
        flex: 1,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 24,
        paddingHorizontal: 20,
        fontSize: 14,
        color: '#111827',
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    replyingIndicator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 8,
        backgroundColor: '#F3F4F6',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    replyingToText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
    }
});

export default CommentModal;
