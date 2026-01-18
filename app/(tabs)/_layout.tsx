import { Home01Icon } from "@hugeicons/core-free-icons";

import ChatIcon from "@/assets/images/icons/chat.svg";
import PawIcon from "@/assets/images/icons/paw.svg";
import ProfileIcon from "@/assets/images/icons/profile.svg";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tabs, useSegments } from "expo-router";
import { StyleSheet, View } from "react-native";

const ACTIVE_COLOR = Colors.primary;
const INACTIVE_COLOR = Colors.placeholder;

export default function TabLayout() {
  const segments = useSegments();

  // The segments for main tabs are typically ['(tabs)', 'home'], ['(tabs)', 'pethub'], etc.
  // Sub-pages will have more segments, e.g., ['(tabs)', 'home', 'myPets']
  const isExcludedPage = segments.length > 2;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: [styles.tabBar, isExcludedPage ? { display: "none" } : {}],
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              <HugeiconsIcon icon={Home01Icon} size={size} color={color} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            console.log("clicked on home");
          },
        }}
      />
      <Tabs.Screen
        name="pethub"
        options={{
          title: "PetHub",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              <PawIcon width={size} height={size} color={color} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            console.log("clicked on pethub");
          },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              <ChatIcon width={size} height={size} color={color} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            console.log("clicked on chat");
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeIndicator} />}
              <ProfileIcon width={size} height={size} color={color} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            console.log("clicked on account");
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: Spacing.xs,
    left: Spacing.lg,
    right: Spacing.lg,
    elevation: 5,
    backgroundColor: Colors.background,
    borderRadius: Spacing.xxl,
    height: 60,
    paddingBottom: 0,
    borderTopWidth: 0,
    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabBarLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  activeIndicator: {
    position: "absolute",
    top: -5,
    width: 40,
    height: Spacing.xs,
    backgroundColor: ACTIVE_COLOR,
    borderBottomLeftRadius: Spacing.xs,
    borderBottomRightRadius: Spacing.xs,
  },
});
