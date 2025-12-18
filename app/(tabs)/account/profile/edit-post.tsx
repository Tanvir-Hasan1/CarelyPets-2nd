import Header from '@/components/ui/Header';
import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/colors';
import { useRouter } from 'expo-router';
import {
    Camera,
    Eye,
    Image as ImageIcon,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditPostScreen() {
    const router = useRouter();
    const [postText, setPostText] = useState("");
    const [files, setFiles] = useState([
        { id: 1, name: 'File name', type: '245KB' },
        { id: 2, name: 'File name', type: '245KB' },
        { id: 3, name: 'File name', type: '245KB' },
    ]);

    const handleUpdate = () => {
        // Logic to update post
        router.back();
    };

    const removeFile = (id: number) => {
        setFiles(files.filter(f => f.id !== id));
    };

    return (
        <View style={styles.container}>
            <Header title="Edit Post" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    {/* User & Input Card */}
                    <View style={styles.card}>
                        <View style={styles.userInfo}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1549488497-1502dc85c4ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
                                style={styles.avatar}
                            />
                            <View>
                                <Text style={styles.userName}>Tuval Smith</Text>
                                <Text style={styles.userHandle}>@tuval</Text>
                            </View>
                        </View>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Say something"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            textAlignVertical="top"
                            value={postText}
                            onChangeText={setPostText}
                        />

                        <View style={styles.actionsRow}>
                            <TouchableOpacity style={styles.iconButton}>
                                <ImageIcon size={24} color={Colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <Camera size={24} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* File Attachments */}
                    <View style={styles.filesContainer}>
                        {files.map((file) => (
                            <View key={file.id} style={styles.fileCard}>
                                <View style={styles.fileIconBox}>
                                    <ImageIcon size={20} color="#8B5CF6" />
                                </View>
                                <View style={styles.fileInfo}>
                                    <Text style={styles.fileName}>{file.name}</Text>
                                    <Text style={styles.fileMeta}>File type  ●  {file.type}</Text>
                                </View>
                                <View style={styles.fileActions}>
                                    <TouchableOpacity style={styles.fileActionBtn}>
                                        <Eye size={20} color="#4B5563" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.fileActionBtn}
                                        onPress={() => removeFile(file.id)}
                                    >
                                        <X size={20} color="#4B5563" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                        <Text style={styles.updateButtonText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        backgroundColor: Colors.lightGray,
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 0.5,
        marginBottom: 20,
        minHeight: 200,
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
        backgroundColor: Colors.primary,
    },
    userName: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
        color: Colors.text,
    },
    userHandle: {
        fontSize: FontSizes.sm,
        color: '#6B7280',
    },
    textInput: {
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.lightGray,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 12,

        flex: 1,
        fontSize: FontSizes.md,
        color: '#374151',
        minHeight: 120,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    iconButton: {
        padding: 4,
    },
    filesContainer: {
        backgroundColor: Colors.background,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.md,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 0.5,
    },
    fileCard: {
        backgroundColor: Colors.lightGray,
        borderRadius: BorderRadius.md,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EDE9FE', // Light purple
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    fileMeta: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    fileActions: {
        flexDirection: 'row',
        gap: 12,
    },
    fileActionBtn: {
        padding: 4,
    },
    footer: {
        padding: 20,
        paddingBottom: 100, // Clear tab bar
        backgroundColor: '#F9FAFB',
    },
    updateButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    updateButtonText: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
        color: Colors.background,
    },
});
