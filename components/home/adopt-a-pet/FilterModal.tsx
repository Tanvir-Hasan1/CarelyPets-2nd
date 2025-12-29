import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors/index";
import { getRecentSearches, saveRecentSearch } from "@/utils/storage";
import { ArrowLeft02Icon, Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Modal,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onReset: () => void;
    onApply: (filters: FilterState) => void;
    initialFilters: FilterState;
}

export interface FilterState {
    query: string;
    gender: string;
    petType: string[];
    ageRange: [number, number];
    availability: string;
}

const GENDER_OPTIONS = ["Male", "Female"];
const PET_TYPES = ["Dog", "Cat", "Small Pet", "Bird", "Exotic Pet"];
const AVAILABILITY_OPTIONS = ["Available", "Owned"];

export default function FilterModal({
    visible,
    onClose,
    onReset,
    onApply,
    initialFilters,
}: FilterModalProps) {
    const insets = useSafeAreaInsets();
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [sliderWidth, setSliderWidth] = useState(0);
    const sliderPadding = 40;

    // Use refs to avoid stale closures in PanResponder
    const filtersRef = useRef(filters);
    const sliderWidthRef = useRef(sliderWidth);

    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    useEffect(() => {
        sliderWidthRef.current = sliderWidth;
    }, [sliderWidth]);

    useEffect(() => {
        if (visible) {
            loadSearches();
            setFilters(initialFilters);
        }
    }, [visible, initialFilters]);

    const loadSearches = async () => {
        const searches = await getRecentSearches();
        setRecentSearches(searches);
    };

    const handleReset = () => {
        const resetFilters: FilterState = {
            query: "",
            gender: "",
            petType: [],
            ageRange: [0, 250],
            availability: "",
        };
        setFilters(resetFilters);
        onReset();
    };

    const togglePetType = (type: string) => {
        setFilters((prev) => {
            const petType = prev.petType.includes(type)
                ? prev.petType.filter((t) => t !== type)
                : [...prev.petType, type];
            return { ...prev, petType };
        });
    };

    const handleApply = async () => {
        if (filters.query) {
            await saveRecentSearch(filters.query);
        }
        onApply(filters);
        onClose();
    };

    const handleRecentPress = (search: string) => {
        setFilters(prev => ({ ...prev, query: search }));
    };

    // --- RANGE SLIDER LOGIC ---
    const calculateValue = (px: number) => {
        const width = sliderWidthRef.current;
        if (width === 0) return 0;
        const effectiveWidth = width - (sliderPadding * 2);
        const relativeX = px - (SCREEN_WIDTH - width) / 2 - sliderPadding;
        const val = Math.round((relativeX / effectiveWidth) * 250);
        return Math.max(0, Math.min(250, val));
    };

    const leftPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newMin = calculateValue(gestureState.moveX);
                const currentFilters = filtersRef.current;
                if (newMin < currentFilters.ageRange[1]) {
                    setFilters(prev => ({ ...prev, ageRange: [newMin, prev.ageRange[1]] }));
                }
            },
        })
    ).current;

    const rightPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newMax = calculateValue(gestureState.moveX);
                const currentFilters = filtersRef.current;
                if (newMax > currentFilters.ageRange[0]) {
                    setFilters(prev => ({ ...prev, ageRange: [prev.ageRange[0], newMax] }));
                }
            },
        })
    ).current;

    const leftHandlePos = sliderWidth > 0 ? (filters.ageRange[0] / 250) * (sliderWidth - sliderPadding * 2) + sliderPadding : sliderPadding;
    const rightHandlePos = sliderWidth > 0 ? (filters.ageRange[1] / 250) * (sliderWidth - sliderPadding * 2) + sliderPadding : sliderPadding;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContent, { paddingBottom: insets.bottom + Spacing.md }]}>
                    <View style={styles.header}>
                        <View style={styles.headerIndicator} />
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetText}>RESET</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.searchContainer}>
                            <TouchableOpacity onPress={onClose} style={styles.backButton}>
                                <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={Colors.text} />
                            </TouchableOpacity>
                            <View style={styles.searchBar}>
                                <HugeiconsIcon icon={Search01Icon} size={20} color={Colors.textSecondary} />
                                <TextInput
                                    style={styles.searchInput}
                                    value={filters.query}
                                    placeholder="Search"
                                    onChangeText={(text) => setFilters(prev => ({ ...prev, query: text }))}
                                />
                                {filters.query.length > 0 && (
                                    <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, query: "" }))}>
                                        <HugeiconsIcon icon={Cancel01Icon} size={18} color={Colors.textSecondary} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity style={styles.searchSubmit} onPress={handleApply}>
                                <HugeiconsIcon icon={Search01Icon} size={20} color={Colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>SEARCHING</Text>
                            <Text style={styles.searchingText}>"{filters.query || "Enter search term"}"</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>RECENT SEARCH</Text>
                            <View style={styles.chipRow}>
                                {recentSearches.length === 0 ? (
                                    <Text style={styles.emptyText}>No recent searches</Text>
                                ) : (
                                    recentSearches.map((search) => (
                                        <TouchableOpacity
                                            key={search}
                                            style={styles.chip}
                                            onPress={() => handleRecentPress(search)}
                                        >
                                            <Text style={styles.chipText}>{search}</Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>GENDER</Text>
                            <View style={styles.chipRow}>
                                {GENDER_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.chip,
                                            filters.gender === option && styles.activeChip,
                                        ]}
                                        onPress={() => setFilters(prev => ({ ...prev, gender: option }))}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            filters.gender === option && styles.activeChipText,
                                        ]}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>PET TYPE</Text>
                            <View style={styles.chipRow}>
                                {PET_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.chip,
                                            filters.petType.includes(type) && styles.activeChip,
                                        ]}
                                        onPress={() => togglePetType(type)}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            filters.petType.includes(type) && styles.activeChipText,
                                        ]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>AGE</Text>
                            <View
                                style={styles.sliderContainer}
                                onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                            >
                                <View style={styles.sliderRail} />
                                <View style={[styles.sliderTrack, {
                                    left: leftHandlePos,
                                    width: rightHandlePos - leftHandlePos
                                }]} />
                                <View
                                    {...leftPanResponder.panHandlers}
                                    style={[styles.sliderHandleContainer, { left: leftHandlePos - 20 }]}
                                >
                                    <View style={styles.sliderHandle} />
                                </View>
                                <View
                                    {...rightPanResponder.panHandlers}
                                    style={[styles.sliderHandleContainer, { left: rightHandlePos - 20 }]}
                                >
                                    <View style={styles.sliderHandle} />
                                </View>
                            </View>
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderLabel}>{filters.ageRange[0]} YEARS</Text>
                                <Text style={styles.sliderLabel}>{filters.ageRange[1]} YEARS</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>AVAILABILITY</Text>
                            <View style={styles.chipRow}>
                                {AVAILABILITY_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.chip,
                                            filters.availability === option && styles.activeChip,
                                        ]}
                                        onPress={() => setFilters(prev => ({ ...prev, availability: option }))}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            filters.availability === option && styles.activeChipText,
                                        ]}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: Spacing.sm,
        maxHeight: "90%",
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md, // Increased padding as requested
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    headerIndicator: {
        width: 40,
        height: 4,
        backgroundColor: "#E5E7EB",
        borderRadius: 2,
        position: "absolute",
        top: 0,
    },
    resetButton: {
        position: "absolute",
        right: Spacing.lg,
        top: Spacing.sm, // Adjusted top position
    },
    resetText: {
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.bold,
        color: "#00A8CC",
        marginBottom: 4, // Added small bottom gap as requested
    },
    searchContainer: {
        marginTop: Spacing.md,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
    },
    backButton: {
        padding: Spacing.xs,
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: Spacing.md,
        height: 48,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    searchInput: {
        flex: 1,
        marginLeft: Spacing.xs,
        fontSize: 14,
        color: Colors.text,
    },
    searchSubmit: {
        width: 48,
        height: 48,
        backgroundColor: "#B2EBF2",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    section: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: FontWeights.bold,
        color: Colors.text,
        marginBottom: Spacing.xs,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    searchingText: {
        fontSize: 14,
        fontWeight: FontWeights.medium,
        color: Colors.text,
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    activeChip: {
        backgroundColor: "#B2EBF2",
        borderColor: "#00A8CC",
    },
    chipText: {
        fontSize: 14,
        color: "#4B5563",
    },
    activeChipText: {
        color: "#006064",
        fontWeight: FontWeights.medium,
    },
    emptyText: {
        fontSize: 12,
        color: "#9CA3AF",
        fontStyle: "italic",
    },
    sliderContainer: {
        height: 30, // Increased height for better interaction
        justifyContent: "center",
        marginVertical: Spacing.xs,
    },
    sliderRail: {
        height: 4,
        backgroundColor: "#F3F4F6",
        borderRadius: 2,
        marginHorizontal: 40, // Match sliderPadding
    },
    sliderTrack: {
        height: 4,
        backgroundColor: "#00A8CC",
        borderRadius: 2,
        position: "absolute",
    },
    sliderHandleContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 10,
    },
    sliderHandle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#00A8CC",
    },
    sliderLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sliderLabel: {
        fontSize: 12,
        fontWeight: FontWeights.bold,
        color: Colors.text,
    },
});
