import { BorderRadius, Colors, FontSizes, Spacing } from "@/constants/colors";
import { Cancel01Icon, Download04Icon, File02Icon, Image02Icon, Upload02Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AttachmentsStepProps {
    data: any;
    updateData: (key: string, value: any) => void;
}



export default function AttachmentsStep({ data, updateData }: AttachmentsStepProps) {
    const files = data.attachments || [];

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
                multiple: true
            });

            if (!result.canceled && result.assets) {
                const newFiles = result.assets.map((asset: any) => ({
                    uri: asset.uri,
                    name: asset.name,
                    size: formatSize(asset.size),
                    mimeType: asset.mimeType,
                    type: getFileType(asset.mimeType, asset.name)
                }));
                updateData('attachments', [...files, ...newFiles]);
            }
        } catch (err) {
            console.log("Error picking document:", err);
        }
    };

    const handleRemoveFile = (index: number) => {
        const updatedFiles = files.filter((_: any, i: number) => i !== index);
        updateData('attachments', updatedFiles);
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getFileType = (mime?: string, name?: string) => {
        if (mime?.includes('image') || name?.match(/\.(jpg|jpeg|png|gif)$/i)) return 'IMAGE';
        if (mime?.includes('pdf') || name?.match(/\.pdf$/i)) return 'PDF';
        return 'DOC';
    };

    const getFileIcon = (type: string) => {
         switch (type) {
             case 'IMAGE': return { icon: Image02Icon, color: '#7C4DFF', bgColor: '#EDE7F6' };
             case 'PDF': return { icon: File02Icon, color: '#FF5252', bgColor: '#FFEBEE' };
             default: return { icon: File02Icon, color: '#448AFF', bgColor: '#E3F2FD' };
         }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.sectionTitle}>Attachments</Text>
                    <Text style={styles.subtitle}>(You can upload documents & images)</Text>
                </View>
                 <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                    <HugeiconsIcon icon={Upload02Icon} size={20} color={Colors.text} />
                    <Text style={styles.uploadButtonText}>Upload</Text>
                 </TouchableOpacity>
             </View>

            <View style={styles.fileList}>
                {files.map((file: any, index: number) => {
                    const styleInfo = getFileIcon(file.type);
                    return (
                        <View key={index} style={styles.fileItem}>
                             <View style={styles.fileLeft}>
                                <View style={[styles.iconCircle, { backgroundColor: styleInfo.bgColor }]}>
                                    <HugeiconsIcon icon={styleInfo.icon} size={20} color={styleInfo.color} />
                                </View>
                                <View>
                                    <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                                    <Text style={styles.fileInfo}>{file.type}  ●  {file.size}</Text>
                                </View>
                             </View>
                             
                            <View style={styles.fileActions}>
                                 <TouchableOpacity style={styles.actionIcon}>
                                    <HugeiconsIcon icon={(file.type === 'IMAGE') ? ViewIcon : Download04Icon} size={20} color={Colors.textSecondary} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionIcon} onPress={() => handleRemoveFile(index)}>
                                    <HugeiconsIcon icon={Cancel01Icon} size={20} color={Colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.sm,
    },
    sectionTitle: {
        fontSize: FontSizes.md,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
     subtitle: {
        fontSize: FontSizes.xs,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        // marginBottom: Spacing.md,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#B2EBF2', // Light cyan
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
    },
    uploadButtonText: {
        fontSize: FontSizes.sm,
        fontWeight: 'bold',
        color: Colors.text,
    },
    fileList: {
        gap: Spacing.sm,
    },
    fileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    fileLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileName: {
        fontSize: FontSizes.sm,
        fontWeight: 'bold',
        color: Colors.text,
        flex: 1, 
        marginRight: 8,
    },
    fileInfo: {
        fontSize: FontSizes.xs,
        color: Colors.textSecondary,
    },
    fileActions: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    actionIcon: {
        padding: 4,
    }
});
