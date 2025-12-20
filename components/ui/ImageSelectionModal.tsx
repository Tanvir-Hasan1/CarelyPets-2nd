import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/colors';
import { Camera01Icon, Cancel01Icon, ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onCamera: () => void;
    onGallery: () => void;
    title?: string;
}

const ImageSelectionModal = ({
    visible,
    onClose,
    onCamera,
    onGallery,
    title = "Update Profile Photo",
}: ImageSelectionModalProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <HugeiconsIcon icon={Cancel01Icon} size={24} color={Colors.text} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => {
                                onCamera();
                                onClose();
                            }}
                        >
                            <View style={styles.iconWrapper}>
                                <HugeiconsIcon icon={Camera01Icon} size={24} color="#006064" />
                            </View>
                            <Text style={styles.optionText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => {
                                onGallery();
                                onClose();
                            }}
                        >
                            <View style={styles.iconWrapper}>
                                <HugeiconsIcon icon={ViewIcon} size={24} color="#006064" />
                            </View>
                            <Text style={styles.optionText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
        backgroundColor: Colors.background,
        borderTopLeftRadius: BorderRadius.lg,
        borderTopRightRadius: BorderRadius.lg,
        padding: Spacing.lg,
        paddingBottom: Spacing.xl * 2,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    modalTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.text,
    },
    closeButton: {
        padding: 4,
    },
    optionsContainer: {
        marginTop: Spacing.sm,
        gap: Spacing.md,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0F7FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    optionText: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.medium,
        color: Colors.text,
    },
});

export default ImageSelectionModal;
