import { Colors } from '@/constants/colors';
import { Edit3, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostOptionsDropdownProps {
    visible: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const PostOptionsDropdown = ({
    visible,
    onClose,
    onEdit,
    onDelete
}: PostOptionsDropdownProps) => {
    if (!visible) return null;

    return (
        <View style={dropdownStyles.container}>
            <TouchableOpacity
                style={dropdownStyles.option}
                onPress={() => {
                    onClose();
                    onDelete();
                }}
            >
                <Trash2 size={18} color="#EF4444" />
                <Text style={dropdownStyles.deleteText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={dropdownStyles.option}
                onPress={() => {
                    onClose();
                    onEdit();
                }}
            >
                <Edit3 size={18} color={Colors.primary} />
                <Text style={dropdownStyles.editText}>Edit</Text>
            </TouchableOpacity>
        </View>
    );
};

const dropdownStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 30,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 100,
        minWidth: 120,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        gap: 10,
    },
    deleteText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#EF4444',
    },
    editText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.primary,
    },
});

export default PostOptionsDropdown;
