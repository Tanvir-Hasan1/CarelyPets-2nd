import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PetPalReportModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectOther: () => void;
}

const REPORT_CATEGORIES = [
    {
        title: 'CONTENT VIOLATIONS',
        items: [
            'Inappropriate content',
            'Sexually abusive',
            'Nudity',
            'Misinformation',
            'Other'
        ]
    },
    {
        title: 'BEHAVIORAL VIOLATIONS',
        items: [
            'Abusive language',
            'Harassment',
            'Spam'
        ]
    },
    {
        title: 'POLICY & LEGAL VIOLATIONS',
        items: [
            'Animal cruelty',
            'Impersonation',
            'Copyright infringement'
        ]
    }
];

const PetPalReportModal = ({ visible, onClose, onSelectOther }: PetPalReportModalProps) => {
    const insets = useSafeAreaInsets();

    const handleSelect = (item: string) => {
        if (item === 'Other') {
            onSelectOther();
        } else {
            // In a real app, we would submit the report here
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.dismissArea} onPress={onClose} />
                <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
                    <View style={styles.handle} />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {REPORT_CATEGORIES.map((section, sIndex) => (
                            <View key={sIndex} style={styles.section}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <View style={styles.itemsContainer}>
                                    {section.items.map((item, iIndex) => (
                                        <TouchableOpacity
                                            key={iIndex}
                                            style={[
                                                styles.item,
                                                iIndex === section.items.length - 1 && styles.lastItem
                                            ]}
                                            onPress={() => handleSelect(item)}
                                        >
                                            <Text style={styles.itemText}>{item}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingHorizontal: 20,
    },
    handle: {
        width: 60,
        height: 4,
        backgroundColor: '#666',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    itemsContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        overflow: 'hidden',
    },
    item: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    itemText: {
        fontSize: 16,
        color: '#111',
        fontWeight: '500',
    },
});

export default PetPalReportModal;
