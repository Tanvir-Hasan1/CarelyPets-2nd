import Header from '@/components/ui/Header';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePostScreen() {
    const router = useRouter();
    const [postText, setPostText] = useState("");

    const handlePost = () => {
        // Logic to submit post
        router.back();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header title="Create Post" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.card}>
                    {/* User Info */}
                    <View style={styles.userInfo}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1549488497-1502dc85c4ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }} // Standard avatar placeholder
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.userName}>Tuval Smith</Text>
                            <Text style={styles.userHandle}>@tuval</Text>
                        </View>
                    </View>

                    {/* Input Area */}
                    <TextInput
                        style={styles.textInput}
                        placeholder="Say something"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        value={postText}
                        onChangeText={setPostText}
                    />

                    {/* Action Icons */}
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.iconButton}>
                            <ImageIcon size={24} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Camera size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Post Button */}
                <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 20,
        height: 250, // Minimum height for the card
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: '#E5E7EB',
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    userHandle: {
        fontSize: 14,
        color: '#6B7280',
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 16,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    iconButton: {
        padding: 4,
    },
    postButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    postButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
