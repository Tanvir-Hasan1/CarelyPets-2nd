import { BorderRadius, Colors, FontSizes, Spacing } from "@/constants/colors";
import {
    ArrowDown01Icon,
    ArrowLeft02Icon,
    ArrowRight02Icon,
    Calendar03Icon,
    DollarSquareIcon,
    Tick02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface RecordDetailsStepProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

// Simple Calendar Component
const CustomDatePicker = ({ 
    visible, 
    onClose, 
    onSelect, 
    initialDate 
}: { 
    visible: boolean; 
    onClose: () => void; 
    onSelect: (date: string) => void;
    initialDate?: string;
}) => {
    const isValidDate = (d: Date) => d instanceof Date && !isNaN(d.getTime());

    const parseDate = (dateString?: string) => {
        if (!dateString) return new Date();
        const date = new Date(dateString);
        if (isValidDate(date)) return date;
        
        // Fallback for simple MM/DD/YYYY parsing if standard constructor fails
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const d = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
            if (isValidDate(d)) return d;
        }
        return new Date();
    };

    const [currentDate, setCurrentDate] = useState(parseDate(initialDate));
    const [selectedDate, setSelectedDate] = useState(initialDate ? parseDate(initialDate) : null);

    React.useEffect(() => {
        if (visible) {
            const date = parseDate(initialDate);
            setCurrentDate(isValidDate(date) ? date : new Date());
            
            if (initialDate) {
                const selDate = parseDate(initialDate);
                // Only set selected if it matches the initialString roughly or is valid
                setSelectedDate(isValidDate(selDate) ? selDate : null);
            } else {
                setSelectedDate(null);
            }
        }
    }, [visible, initialDate]);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayPress = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(date);
        const formatted = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${date.getFullYear()}`;
        onSelect(formatted);
        onClose();
    };

    const renderCalendarDays = () => {
        const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
        const startDay = firstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());
        const days = [];

        // Empty slots
        for (let i = 0; i < startDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
        }

        for (let i = 1; i <= totalDays; i++) {
            const isSelected = selectedDate && 
                selectedDate.getDate() === i && 
                selectedDate.getMonth() === currentDate.getMonth() && 
                selectedDate.getFullYear() === currentDate.getFullYear();

            days.push(
                <TouchableOpacity 
                    key={i} 
                    style={[styles.calendarDay, isSelected && styles.selectedDay]} 
                    onPress={() => handleDayPress(i)}
                >
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{i}</Text>
                </TouchableOpacity>
            );
        }

        return days;
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={[styles.modalContent, { width: '90%' }]}>
                     {/* Header */}
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={handlePrevMonth}>
                            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={Colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.monthTitle}>
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </Text>
                        <TouchableOpacity onPress={handleNextMonth}>
                             <HugeiconsIcon icon={ArrowRight02Icon} size={24} color={Colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Week Days Header */}
                    <View style={styles.weekDays}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                            <Text key={index} style={styles.weekDayText}>{day}</Text>
                        ))}
                    </View>

                    {/* Days Grid */}
                    <View style={styles.daysGrid}>
                        {renderCalendarDays()}
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const ReminderOptions = ['No reminder', '1 week', '5 day', '3 day', 'one day', 'current day'];

export default function RecordDetailsStep({ data, updateData }: RecordDetailsStepProps) {
    const [datePickerVisible, setDatePickerVisible] = useState<'date' | 'nextDue' | null>(null);
    const [reminderModalVisible, setReminderModalVisible] = useState(false);

    const handleDateSelect = (date: string) => {
        if (datePickerVisible === 'date') updateData('date', date);
        if (datePickerVisible === 'nextDue') updateData('nextDueDate', date);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Record Details</Text>

            {/* Record Type */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>RECORD TYPE</Text>
                <View style={[styles.input, { backgroundColor: '#EEEEEE' }]}>
                    <Text style={{ color: Colors.text }}>{data.recordType || 'None Selected'}</Text>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>RECORD NAME</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Rabies Vaccination"
                    value={data.recordName}
                    onChangeText={(text) => updateData('recordName', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>BATCH/LOT NO.</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Vaccine or medication batch number"
                    value={data.batchNumber}
                    onChangeText={(text) => updateData('batchNumber', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>OTHER</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Fill this with other necessary information"
                    value={data.otherInfo}
                    onChangeText={(text) => updateData('otherInfo', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>COST</Text>
                <View style={styles.iconInputContainer}>
                   <HugeiconsIcon icon={DollarSquareIcon} size={20} color={Colors.textSecondary} /> 
                   <TextInput
                        style={styles.iconInputTextInput}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={data.cost}
                        onChangeText={(text) => updateData('cost', text)}
                    />
                </View>
            </View>

            {/* Dates - Stacked Column Wise */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>DATE</Text>
                <TouchableOpacity 
                    style={styles.iconInputContainer} 
                    onPress={() => setDatePickerVisible('date')}
                >
                    <Text style={[styles.iconInputText, !data.date && { color: '#999' }]}>
                        {data.date || 'mm/dd/yyyy'}
                    </Text>
                    <HugeiconsIcon icon={Calendar03Icon} size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>NEXT DUE DATE</Text>
                <TouchableOpacity 
                    style={styles.iconInputContainer}
                    onPress={() => setDatePickerVisible('nextDue')}
                >
                    <Text style={[styles.iconInputText, !data.nextDueDate && { color: '#999' }]}>
                        {data.nextDueDate || 'mm/dd/yyyy'}
                    </Text>
                    <HugeiconsIcon icon={Calendar03Icon} size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>
            
            {/* Reminder Section */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>SET REMINDER</Text>
                 <View style={styles.reminderContainer}>
                    {/* Reminder Label Box - Static/Uninteractive */}
                    <View style={styles.reminderBox}>
                         <HugeiconsIcon 
                            icon={Calendar03Icon} 
                            size={20} 
                            color={Colors.textSecondary} 
                         />
                         <Text style={styles.reminderText}>Remind me before next due</Text>
                    </View>

                    {/* Duration Dropdown */}
                    <TouchableOpacity 
                        style={styles.reminderDropdown}
                        onPress={() => setReminderModalVisible(true)}
                    >
                        <Text style={styles.dropdownText} numberOfLines={1}>
                            {data.reminderDuration || 'No reminder'}
                        </Text>
                        <HugeiconsIcon icon={ArrowDown01Icon} size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                 </View>
            </View>

            {/* Date Picker Modal */}
            <CustomDatePicker 
                visible={!!datePickerVisible}
                onClose={() => setDatePickerVisible(null)}
                onSelect={handleDateSelect}
                initialDate={datePickerVisible === 'date' ? data.date : data.nextDueDate}
            />

            {/* Reminder Options Modal */}
            <Modal
                visible={reminderModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setReminderModalVisible(false)}
            >
                <Pressable 
                    style={styles.modalOverlay} 
                    onPress={() => setReminderModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Reminder Time</Text>
                        {ReminderOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.optionItem}
                                onPress={() => {
                                    updateData('reminderDuration', option);
                                    if (option === 'No reminder') {
                                        updateData('reminderEnabled', false);
                                    } else {
                                        updateData('reminderEnabled', true);
                                    }
                                    setReminderModalVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.optionText,
                                    data.reminderDuration === option && styles.selectedOptionText
                                ]}>{option}</Text>
                                {data.reminderDuration === option && (
                                    <HugeiconsIcon icon={Tick02Icon} size={20} color={Colors.primary} variant="solid" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.sm,
    },
    sectionTitle: {
        fontSize: FontSizes.md,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    inputGroup: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: FontSizes.xs,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
        fontWeight: '600'
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: FontSizes.sm,
        color: Colors.text,
    },
    iconInputContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        height: 50,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconInputTextInput: {
        fontSize: FontSizes.sm,
        color: Colors.text,
        flex: 1,
        marginLeft: Spacing.sm,
    },
    iconInputText: {
        fontSize: FontSizes.sm,
        color: Colors.text,
    },
    reminderContainer: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    reminderBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        gap: Spacing.xs,
    },
    reminderBoxActive: {
        backgroundColor: '#E0F7FA',
        borderColor: Colors.primary,
    },
    reminderText: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        flex: 1,
    },
    reminderTextActive: {
        color: Colors.primary,
        fontWeight: '600',
    },
    reminderDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        width: 130, // Fixed width
    },
    dropdownText: {
        fontSize: FontSizes.sm,
        color: Colors.text,
        flex: 1,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        width: '80%',
        maxHeight: '60%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: FontSizes.md,
        fontWeight: 'bold',
        marginBottom: Spacing.lg,
        textAlign: 'center',
        color: Colors.text,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    optionText: {
        fontSize: FontSizes.sm,
        color: Colors.text,
    },
    selectedOptionText: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    // Calendar Styles
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    monthTitle: {
        fontSize: FontSizes.md,
        fontWeight: 'bold',
        color: Colors.text,
    },
    weekDays: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    weekDayText: {
        width: 30,
        textAlign: 'center',
        color: Colors.textSecondary,
        fontSize: FontSizes.xs,
        fontWeight: 'bold',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    calendarDay: {
        width: '14.28%', // 7 days
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    selectedDay: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
    },
    dayText: {
        fontSize: FontSizes.sm,
        color: Colors.text,
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
