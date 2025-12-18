import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface LogoutComponentProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutComponent = ({
    visible,
    onClose,
    onConfirm,
}: LogoutComponentProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            {/* Icon */}
                            <View style={styles.iconContainer}>
                                <Text style={styles.iconText}>!</Text>
                            </View>

                            {/* Title */}
                            <Text style={styles.title}>Are you sure you want to logout?</Text>

                            {/* Description */}
                            <Text style={styles.description}>
                                By logging out you will need to sign in again to access your
                                account.
                            </Text>

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onClose}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.logoutButton]}
                                    onPress={onConfirm}
                                >
                                    <Text style={styles.logoutButtonText}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        width: "100%",
        maxWidth: 340,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        width: 60,
        height: 60,
        backgroundColor: "#EF4444", // Red color
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    iconText: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "bold",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000000",
        textAlign: "center",
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: "#6B7280", // Gray-500
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        backgroundColor: "#F3F4F6", // Light gray
    },
    cancelButtonText: {
        color: "#374151", // Gray-700
        fontSize: 16,
        fontWeight: "600",
    },
    logoutButton: {
        backgroundColor: "#EF4444", // Red
    },
    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default LogoutComponent;