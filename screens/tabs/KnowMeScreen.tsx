import { MOCK_PETS } from "@/app/(tabs)/home/adopt-pet/index";
import FemaleIcon from "@/assets/images/icons/female.svg";
import MaleIcon from "@/assets/images/icons/male.svg";
import { HealthRecordItem, PersonalityTag, ShelterInfoCard } from "@/components/home/adopt-a-pet/KnowMeComponents";
import Header from "@/components/ui/Header";
import {
    Colors,
    FontWeights,
    Spacing
} from "@/constants/colors/index";
import { usePetStore } from "@/store/usePetStore";
import {
    Calendar03Icon,
    Note01Icon,
    Notification02Icon,
    WeightScale01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get("window");

export default function KnowMeScreen({ id }: { id: string }) {
    const router = useRouter();
    const { pets } = usePetStore();
    const pet = pets.find((p) => p.id === id) || (MOCK_PETS as any[]).find((p) => p.id === id);
    const [activeSlide, setActiveSlide] = useState(0);

    if (!pet) {
        return (
            <View style={styles.center}>
                <Text style={{ fontSize: 18, color: Colors.text }}>Pet not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10 }}>
                    <Text style={{ color: "#00BCD4", fontWeight: 'bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const images = pet.snaps && pet.snaps.length > 0 ? pet.snaps : [pet.image || "https://images.unsplash.com/photo-1543852786-1cf6624b9987"];

    const healthRecords = [
        { id: '1', title: 'Vaccination', date: 'Last updated Jan 6, 2025', icon: Note01Icon, color: '#4CAF50' },
        { id: '2', title: 'Check-up', date: 'Last updated Jan 6, 2025', icon: Calendar03Icon, color: '#2196F3' },
        { id: '3', title: 'Medication', date: 'Last updated Jan 6, 2025', icon: Notification02Icon, color: '#F44336' },
        { id: '4', title: 'Flea & Tick Treatment', date: 'Last updated Jan 6, 2025', icon: Note01Icon, color: '#9C27B0' },
        { id: '5', title: 'Surgery', date: 'Last updated Jan 6, 2025', icon: Note01Icon, color: '#E91E63' },
        { id: '6', title: 'Dental', date: 'Last updated Jan 6, 2025', icon: Note01Icon, color: '#FF9800' },
        { id: '7', title: 'Other', date: 'Last updated Jan 6, 2025', icon: Note01Icon, color: '#757575' },
    ];

    const renderImage = ({ item }: { item: string }) => (
        <Image source={{ uri: item }} style={styles.sliderImage} />
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Know Me" style={{ backgroundColor: '#FFFFFF' }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Image Carousel */}
                <View style={styles.carouselContainer}>
                    <FlatList
                        data={images}
                        renderItem={renderImage}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / width);
                            setActiveSlide(index);
                        }}
                        keyExtractor={(_, index: number) => index.toString()}
                    />
                    <View style={styles.paginationBadge}>
                        <Text style={styles.paginationText}>{activeSlide + 1}/{images.length}</Text>
                    </View>
                    <View style={[
                        styles.statusBadge,
                        pet.status === 'Adopted' && styles.statusBadgeAdopted
                    ]}>
                        <Text style={[
                            styles.statusText,
                            pet.status === 'Adopted' && styles.statusTextAdopted
                        ]}>
                            {pet.status || "Available"}
                        </Text>
                    </View>
                    <View style={styles.paginationDots}>
                        {images.map((_: string, i: number) => (
                            <View key={i} style={[styles.dot, activeSlide === i && styles.activeDot]} />
                        ))}
                    </View>
                </View>

                {/* Content Body */}
                <View style={styles.body}>
                    <View style={styles.petHeader}>
                        <Text style={styles.petName}>{pet.name}</Text>
                        <Text style={styles.petBreed}>{pet.breed}</Text>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                                {pet.gender === 'Female' ?
                                    <FemaleIcon width={36} height={36} color="#1976D2" /> :
                                    <MaleIcon width={36} height={34} color="#1976D2" />
                                }
                            </View>
                            <View>
                                <Text style={styles.statLabel}>Gender</Text>
                                <Text style={styles.statValue}>{pet.gender}</Text>
                            </View>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                                <HugeiconsIcon icon={Calendar03Icon} size={20} color="#F57C00" />
                            </View>
                            <View>
                                <Text style={styles.statLabel}>Age</Text>
                                <Text style={styles.statValue}>{pet.age} year</Text>
                            </View>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#F3E5F5' }]}>
                                <HugeiconsIcon icon={WeightScale01Icon} size={20} color="#7B1FA2" />
                            </View>
                            <View>
                                <Text style={styles.statLabel}>Weight</Text>
                                <Text style={styles.statValue}>{pet.weight || '45'} lbs</Text>
                            </View>
                        </View>
                    </View>

                    {/* Simple Tags */}
                    <View style={styles.tagRow}>
                        <View style={[styles.tag, { backgroundColor: '#E8F5E9' }]}>
                            <Text style={[styles.tagText, { color: '#2E7D32' }]}>Vaccinated</Text>
                        </View>
                        <View style={[styles.tag, { backgroundColor: '#F3E5F5' }]}>
                            <Text style={[styles.tagText, { color: '#7B1FA2' }]}>Neutered</Text>
                        </View>
                        <View style={[styles.tag, { backgroundColor: '#E0F7FA' }]}>
                            <Text style={[styles.tagText, { color: '#006064' }]}>Trained</Text>
                        </View>
                    </View>

                    {/* Shelter Info */}
                    <ShelterInfoCard
                        name="Carely Pets"
                        phone="555 458 5555"
                        price="250.00"
                    />

                    {/* About section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About {pet.name}</Text>
                        <Text style={styles.aboutText}>
                            {pet.about || "A playful, affectionate cat who spends her days exploring cozy corners, chasing soft toys, and curling up in warm laps. She's curious, gentle, and always ready to share a quiet moment of comfort. Meow..."}
                            <Text style={styles.seeMore}>See more</Text>
                        </Text>
                    </View>

                    {/* Personality section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Personality</Text>
                        <View style={styles.personalityRow}>
                            <PersonalityTag label="Friendly" color="#2196F3" />
                            <PersonalityTag label="Loyal" color="#FF9800" />
                            <PersonalityTag label="Good with kids" color="#4CAF50" />
                            <PersonalityTag label="Intelligent" color="#9C27B0" />
                            <PersonalityTag label="Energetic" color="#00BCD4" />
                        </View>
                    </View>

                    {/* Health Records section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Health Records</Text>
                        {healthRecords.map((record) => (
                            <HealthRecordItem
                                key={record.id}
                                title={record.title}
                                date={record.date}
                                icon={record.icon}
                                color={record.color}
                            />
                        ))}
                    </View>

                    {/* Adopt Button */}
                    <View style={styles.adoptButtonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.adoptButton,
                                pet.status === 'Adopted' && styles.adoptButtonDisabled
                            ]}
                            disabled={pet.status === 'Adopted'}
                        >
                            <Text style={styles.adoptButtonText}>
                                {pet.status === 'Adopted' ? "Unavailable" : "Adopt Me"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselContainer: {
        height: 380,
        position: 'relative',
    },
    sliderImage: {
        width: width,
        height: 380,
        resizeMode: 'cover',
    },
    paginationBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    paginationText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    statusBadge: {
        position: 'absolute',
        bottom: 50,
        right: 20,
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusBadgeAdopted: {
        backgroundColor: "#FFEBEE",
    },
    statusText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextAdopted: {
        color: '#F44336',
    },
    paginationDots: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255,255,255,0.5)",
    },
    activeDot: {
        backgroundColor: "#00BCD4",
        width: 16,
    },
    body: {
        marginTop: -30,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: Spacing.lg,
    },
    petHeader: {
        marginBottom: Spacing.md,
    },
    petName: {
        fontSize: 28,
        fontWeight: FontWeights.bold,
        color: Colors.text,
    },
    petBreed: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
    },
    statValue: {
        fontSize: 12,
        fontWeight: FontWeights.bold,
        color: Colors.text,
    },
    tagRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: FontWeights.bold,
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    aboutText: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    seeMore: {
        color: '#00BCD4',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    personalityRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    adoptButtonContainer: {
        marginTop: Spacing.xl,
        paddingBottom: Spacing.md,
    },
    adoptButton: {
        backgroundColor: "#00BCD4",
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    adoptButtonDisabled: {
        backgroundColor: "#E0E0E0",
    },
    adoptButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
