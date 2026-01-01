import Paw from "@/assets/images/icons/Paw-solid.svg";
import GroomingIcon from "@/assets/images/icons/grooming.svg";
import TrainingIcon from "@/assets/images/icons/training.svg";
import VetIcon from "@/assets/images/icons/vet.svg";
import WalkingIcon from "@/assets/images/icons/walking.svg";
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/colors';
import { usePetStore } from '@/store/usePetStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Check, Home } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SERVICES: Record<string, { name: string; icon: any }> = {
    vet: { name: 'Vet Visit', icon: VetIcon },
    grooming: { name: 'Full Grooming Session', icon: GroomingIcon },
    training: { name: 'Training Session', icon: TrainingIcon },
    walking: { name: 'Walking Session', icon: WalkingIcon },
};

export default function BookingSuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { pets } = usePetStore();

    const petId = params.petId as string;
    const serviceId = (params.serviceId as string || 'grooming').toLowerCase();
    const service = SERVICES[serviceId] || SERVICES.grooming;
    const pet = pets.find(p => p.id === petId) || pets[0];

    const dateString = params.date ? new Date(params.date as string).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'Tuesday, Oct 25, 2026';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.successIconOuter}>
                    <View style={styles.successIcon}>
                        <Check size={32} color={Colors.primary} strokeWidth={3} />
                    </View>
                </View>

                <Text style={styles.title}>Booking Done!</Text>
                <Text style={styles.subtitle}>
                    Your appointment is booked. We're excited to see {pet?.name || 'Bubby'}!
                </Text>

                <View style={styles.detailsCard}>
                    <DetailItem
                        icon={service.icon}
                        label="SERVICE"
                        value={service.name}
                        iconBg="#E0F7FA"
                        iconColor="#4DD0E1"
                        isSvg={true}
                        svgSize={52}
                    />
                    <DetailItem
                        icon={Calendar}
                        label="DATE & TIME"
                        value={`${dateString}`}
                        iconBg="#E1F5FE"
                        iconColor="#4FC3F7"
                    />
                    <DetailItem
                        icon={Home}
                        label="WITH"
                        value="Carely Pets"
                        iconBg="#E0F2F1"
                        iconColor="#4DB6AC"
                    />
                    <DetailItem
                        icon={Paw}
                        label="FOR"
                        value={pet?.name || 'Bubby'}
                        iconBg="#E8F5E9"
                        iconColor="#81C784"
                        isSvg={true}
                        svgSize={52}
                    />
                </View>

                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => router.push({
                        pathname: '/(tabs)/home/booking/[id]',
                        params: { id: 'latest', serviceId: serviceId }
                    })}
                >
                    <Text style={styles.detailsButtonText}>View Booking Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => router.replace('/(tabs)/home')}
                >
                    <View style={styles.homeButtonContent}>
                        <Text style={styles.homeButtonText}>Back to Home</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Decorative Paw Prints (Simplified) */}
            <View style={[styles.paw, { top: 100, left: 20, opacity: 0.1 }]} />
            <View style={[styles.paw, { bottom: 50, right: 20, opacity: 0.1 }]} />
        </SafeAreaView>
    );
}

const DetailItem = ({ icon: Icon, label, value, iconBg, iconColor, isSvg, svgSize = 40 }: any) => (
    <View style={styles.detailItem}>
        <View style={[styles.detailIcon, { backgroundColor: iconBg }]}>
            {isSvg ? (
                <Icon width={svgSize} height={svgSize} fill={iconColor} />
            ) : (
                <Icon size={28} color={iconColor} />
            )}
        </View>
        <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    successIconOuter: {
        marginBottom: Spacing.xl,
        padding: 10,
        backgroundColor: '#E0F7FA',
        borderRadius: 50,
    },
    successIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    title: {
        fontSize: FontSizes.xxl,
        fontWeight: FontWeights.bold,
        color: '#111827',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSizes.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.xl,
    },
    detailsCard: {
        width: '100%',
        gap: Spacing.lg,
        marginBottom: Spacing.xxl,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    detailInfo: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 10,
        color: Colors.textSecondary,
        fontWeight: FontWeights.bold,
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: FontSizes.md,
        color: '#111827',
        fontWeight: FontWeights.medium,
    },
    detailsButton: {
        width: '100%',
        backgroundColor: '#B2EBF2',
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    detailsButtonText: {
        color: '#006064',
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
    },
    homeButton: {
        padding: Spacing.md,
    },
    homeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#006064',
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
    },
    paw: {
        position: 'absolute',
        width: 100,
        height: 100,
        backgroundColor: '#006064',
        borderRadius: 50,
        zIndex: -1,
    }
});
