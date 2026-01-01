import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/colors';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BookingCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BookingCalendar({ selectedDate, onDateSelect }: BookingCalendarProps) {
    const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

    const prevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const renderDays = () => {
        const dayElements = [];
        // Empty slots for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            dayElements.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }

        // Actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
            const isSelected = selectedDate.getDate() === i &&
                selectedDate.getMonth() === viewDate.getMonth() &&
                selectedDate.getFullYear() === viewDate.getFullYear();

            dayElements.push(
                <TouchableOpacity
                    key={i}
                    style={[styles.dayCell, isSelected && styles.selectedDay]}
                    onPress={() => onDateSelect(date)}
                >
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }

        return dayElements;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={prevMonth}>
                    <ChevronLeft size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.monthYearText}>
                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </Text>
                <TouchableOpacity onPress={nextMonth}>
                    <ChevronRight size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.daysRow}>
                {DAYS.map((day, index) => (
                    <View key={index} style={styles.dayCell}>
                        <Text style={styles.dayLabel}>{day}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.calendarGrid}>
                {renderDays()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        padding: Spacing.md,
        borderRadius: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    monthYearText: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
        color: Colors.text,
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    dayLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
        width: 40,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%', // 100 / 7
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        fontSize: FontSizes.sm,
        color: Colors.text,
    },
    selectedDay: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
    },
    selectedDayText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
