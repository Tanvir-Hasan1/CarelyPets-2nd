import { Ban, Flag } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PetPalPostDropdownProps {
    visible: boolean;
    onClose: () => void;
    onReport: () => void;
    onBlock: () => void;
}

const PetPalPostDropdown = ({ visible, onClose, onReport, onBlock }: PetPalPostDropdownProps) => {
    if (!visible) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.option}
                onPress={() => {
                    onReport();
                    onClose();
                }}
            >
                <Flag size={20} color="#006064" />
                <Text style={styles.optionText}>Report</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
                style={styles.option}
                onPress={() => {
                    onBlock();
                    onClose();
                }}
            >
                <Ban size={20} color="#006064" />
                <Text style={styles.optionText}>Block</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 30,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#B2EBF2',
        zIndex: 1000,
        width: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#004D40',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#B2EBF2',
    },
});

export default PetPalPostDropdown;
