import ChatMenu from "@/components/chat/ChatMenu";
import PetPalBlockModal from "@/components/home/petPals/PetPalBlockModal";
import ImageViewingModal from "@/components/ui/ImageViewingModal";
import { Spacing } from "@/constants/colors";
import { ArrowLeft02Icon, AttachmentIcon, Cancel01Icon, MoreVerticalIcon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Message {
    id: string;
    text: string;
    time: string;
    sender: 'me' | 'other';
    status: 'sent' | 'delivered' | 'read';
    images?: string[];
}

const initialMessages: Message[] = [
    { id: '1', text: 'Hey, how is life.', time: '9:46 AM', sender: 'other', status: 'read' },
    { id: '2', text: 'Good, How about you', time: '9:46 AM', sender: 'me', status: 'read' },
    { id: '3', text: 'Hey, how is life.', time: '9:46 AM', sender: 'other', status: 'read' },
    { id: '4', text: 'Good, How about you', time: '9:46 AM', sender: 'me', status: 'delivered' },
    { id: '5', text: 'Good, How about you', time: '9:46 AM', sender: 'me', status: 'sent' },
];

const MessageBubble = ({ message, onImagePress }: { message: Message, onImagePress: (uri: string) => void }) => {
    const isMe = message.sender === 'me';

    return (
        <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
            <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                {message.images && message.images.length > 0 && (
                    <View style={styles.imageGrid}>
                        {message.images.map((img, index) => (
                            <TouchableOpacity key={index} onPress={() => onImagePress(img)}>
                                <Image source={{ uri: img }} style={styles.messageImage} />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {message.text ? <Text style={styles.messageText}>{message.text}</Text> : null}
                <View style={styles.messageFooter}>
                    <Text style={styles.messageTime}>{message.time}</Text>
                    {isMe && (
                        <Text style={[styles.statusCheck, message.status === 'read' && { color: '#006064' }]}>
                            {message.status === 'sent' ? '✓' : '✓✓'}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default function ChatDetailScreen() {
    const { id, name, avatar } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [messageText, setMessageText] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [blockModalVisible, setBlockModalVisible] = useState(false);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);

    const handleBack = () => router.back();

    const handleAttachment = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            setSelectedImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = () => {
        if (!messageText.trim() && selectedImages.length === 0) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'me',
            status: 'sent',
            images: selectedImages.length > 0 ? selectedImages : undefined,
        };

        setMessages(prev => [...prev, newMessage]);
        setMessageText('');
        setSelectedImages([]);

        // Scroll to bottom
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            {/* Custom Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="#4B5563" />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Image source={{ uri: avatar as string || 'https://i.pravatar.cc/150' }} style={styles.headerAvatar} />
                    <View>
                        <Text style={styles.headerName}>{name || 'User'}</Text>
                        <Text style={styles.headerStatus}>Online</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.menuButton}>
                    <HugeiconsIcon icon={MoreVerticalIcon} size={24} color="#006064" />
                </TouchableOpacity>
            </View>

            <ChatMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                onBlock={() => setBlockModalVisible(true)}
            />

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MessageBubble
                        message={item}
                        onImagePress={(uri) => setViewingImage(uri)}
                    />
                )}
                contentContainerStyle={styles.messageList}
                showsVerticalScrollIndicator={false}
            />

            {/* Input Area */}
            <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
                {selectedImages.length > 0 && (
                    <ScrollView horizontal style={styles.imagePreviewContainer} showsHorizontalScrollIndicator={false}>
                        {selectedImages.map((uri, index) => (
                            <View key={index} style={styles.previewImageWrapper}>
                                <Image source={{ uri }} style={styles.previewImage} />
                                <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                                    <HugeiconsIcon icon={Cancel01Icon} size={16} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                )}

                <View style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder="Message"
                            style={styles.input}
                            value={messageText}
                            onChangeText={setMessageText}
                            multiline
                        />
                        <TouchableOpacity style={styles.attachmentButton} onPress={handleAttachment}>
                            <HugeiconsIcon icon={AttachmentIcon} size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <HugeiconsIcon icon={SentIcon} size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <PetPalBlockModal
                visible={blockModalVisible}
                onClose={() => setBlockModalVisible(false)}
                onConfirm={() => {
                    console.log('Blocked user');
                    setBlockModalVisible(false);
                }}
            />

            <ImageViewingModal
                visible={!!viewingImage}
                imageUri={viewingImage}
                onClose={() => setViewingImage(null)}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.sm,
        backgroundColor: '#F3F4F6',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: Spacing.sm,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    headerStatus: {
        fontSize: 12,
        color: '#6B7280',
    },
    menuButton: {
        padding: Spacing.xs,
    },
    messageList: {
        padding: Spacing.md,
    },
    messageContainer: {
        marginBottom: Spacing.md,
        width: '100%',
        flexDirection: 'row',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    otherMessageContainer: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 12,
    },
    myBubble: {
        backgroundColor: '#B2EBF2',
        borderBottomRightRadius: 2,
    },
    otherBubble: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderBottomLeftRadius: 2,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginBottom: 4,
    },
    messageImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    messageText: {
        fontSize: 15,
        color: '#111827',
        lineHeight: 20,
    },
    messageFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    messageTime: {
        fontSize: 10,
        color: '#6B7280',
    },
    statusCheck: {
        fontSize: 12,
        color: '#6B7280',
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginBottom: Spacing.xxl,
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: Spacing.sm,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        minHeight: 48,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
        paddingVertical: 10,
        maxHeight: 100,
    },
    attachmentButton: {
        marginLeft: 8,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#1DAFB6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
    },
    previewImageWrapper: {
        marginRight: Spacing.sm,
        position: 'relative',
    },
    previewImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#000000',
        borderRadius: 10,
        padding: 2,
        opacity: 0.7,
    },
});
