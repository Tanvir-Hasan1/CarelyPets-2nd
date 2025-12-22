import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type PetPalTab = 'Posts' | 'Photos' | 'My Pets';

interface PetPalTabSwitcherProps {
    activeTab: PetPalTab;
    onTabChange: (tab: PetPalTab) => void;
}

const PetPalTabSwitcher = ({ activeTab, onTabChange }: PetPalTabSwitcherProps) => {
    const tabs: PetPalTab[] = ['Posts', 'Photos', 'My Pets'];

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab
                        ]}
                        onPress={() => onTabChange(tab)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeTab: {
        backgroundColor: '#B2EBF2',
        borderColor: '#B2EBF2',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#006064',
    },
});

export default PetPalTabSwitcher;
