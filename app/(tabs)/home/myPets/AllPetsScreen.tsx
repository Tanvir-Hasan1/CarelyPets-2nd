import {
    BorderRadius,
    Colors,
    FontSizes,
    FontWeights,
    Spacing,
} from "@/constants/colors";
import { usePetStore } from "@/store/usePetStore";
import {
    ArrowLeft02Icon,
    Notification02Icon,
    ShoppingBag02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AllPetsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const pets = usePetStore((state) => state.pets);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <View style={[StyleSheet.absoluteFill, { paddingTop: insets.top, paddingBottom: Spacing.md, justifyContent: 'center', alignItems: 'center' }]} pointerEvents="none">
                    <Text style={styles.headerTitle}>My Pets</Text>
                </View>

                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton}>
                        <HugeiconsIcon icon={ShoppingBag02Icon} size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <HugeiconsIcon icon={Notification02Icon} size={24} color={Colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
                {pets.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No pets added yet!</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(tabs)/home/myPets/add-pet")}>
                            <Text style={styles.addButtonText}>Add your first pet</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {pets.map((pet) => (
                            <TouchableOpacity
                                key={pet.id}
                                style={styles.card}
                                onPress={() => router.push(`/(tabs)/home/myPets/${pet.id}`)}
                            >
                                <Image source={{ uri: pet.image }} style={styles.cardImage} />
                                <View style={styles.cardContent}>
                                    <View style={styles.nameRow}>
                                        <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
                                        <View style={[
                                            styles.genderBadge,
                                            { backgroundColor: pet.gender === 'Female' ? '#FFD1DC' : '#BBDEFB' }
                                        ]}>
                                            <Text style={[
                                                styles.genderText,
                                                { color: pet.gender === 'Female' ? '#C2185B' : '#1976D2' }
                                            ]}>
                                                {pet.gender}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.petDetails}>{pet.breed} • {pet.age} years old</Text>
                                    <View style={styles.petFactsButton}>
                                        <Text style={styles.petFactsText}>Pet Facts</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.background,
    },
    headerTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: "#006064",
    },
    headerActions: {
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    iconButton: {
        padding: Spacing.xs,
        borderRadius: 20,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    gridContent: {
        padding: Spacing.lg,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: Spacing.md,
    },
    card: {
        width: (Dimensions.get('window').width - Spacing.lg * 2 - Spacing.md) / 2, // Main Grid Logic: (ScreenWidth - Padding - Gap) / 2
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.md,
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: Spacing.sm,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    petName: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
        color: Colors.text,
        flex: 1,
    },
    genderBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    genderText: {
        fontSize: 10,
        fontWeight: FontWeights.bold,
    },
    petDetails: {
        fontSize: 10,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    petFactsButton: {
        backgroundColor: '#00BCD4',
        paddingVertical: 6,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    petFactsText: {
        fontSize: 12,
        fontWeight: FontWeights.bold,
        color: '#ffffff',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    addButton: {
        backgroundColor: '#006064',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
    },
    addButtonText: {
        color: '#ffffff',
        fontWeight: FontWeights.bold,
    },
});
