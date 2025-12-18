import MoreSection from "@/components/accounts/MoreSection";
import NotificationSection from "@/components/accounts/NotificationSection";
import ProfileCard from "@/components/accounts/ProfileCard";
import QuickActionsSection from "@/components/accounts/QuickActionsSection";
import Header from "@/components/ui/Header";
import LogoutComponent from "@/components/ui/LogoutComponent";
import { Colors } from "@/constants/colors";
import authService, { User } from "@/services/authService";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getUser();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      setLogoutModalVisible(false);
      await authService.logout();
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Fallback alert if needed, though modal handles flow
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Account" showBackButton={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <ProfileCard
          user={user}
          onPress={() => router.push('/(tabs)/account/profile')}
        />

        {/* Notification Section */}
        <NotificationSection
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
        />

        {/* Quick Actions Section */}
        <QuickActionsSection />

        {/* More Section */}
        <MoreSection />

        {/* Logout */}
        <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <LogOut size={24} color="#EF4444" strokeWidth={1.5} />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Modal */}
      <LogoutComponent
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={confirmLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Light grayish background
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Increased to clear tab bar
    marginTop: 20,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  logoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 0.5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
});
