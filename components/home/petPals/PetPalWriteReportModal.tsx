import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PetPalWriteReportModalProps {
    visible: boolean;
    onClose: () => void;
    onSend: (text: string) => void;
}

const PetPalWriteReportModal = ({ visible, onClose, onSend }: PetPalWriteReportModalProps) => {
    const [reportText, setReportText] = useState('');

    const handleSend = () => {
        onSend(reportText);
        setReportText('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>Write report</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Say something"
                            placeholderTextColor="#999"
                            multiline
                            value={reportText}
                            onChangeText={setReportText}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    inputContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 12,
        height: 120,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    sendButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        backgroundColor: '#E53935',
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default PetPalWriteReportModal;
