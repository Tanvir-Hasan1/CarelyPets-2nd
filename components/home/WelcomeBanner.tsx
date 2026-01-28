import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function WelcomeBanner() {
  const { user } = useAuthStore();
  const firstName = user?.name ? user.name.split(" ")[0] : "Sara";

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Welcome back, {firstName}!</Text>
          <Text style={styles.subtext}>
            Transform pet parenting to Care smarter, bond deeper.
          </Text>
        </View>
        <Image
          source={{
            uri: user?.avatarUrl || "https://i.pravatar.cc/150?img=32",
          }}
          style={styles.avatar}
          contentFit="cover"
          transition={500}
          cachePolicy="memory-disk"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    backgroundColor: "#C6F2F6", // Outer light cyan strip
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E0F7FA", // Inner card lighter cyan
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  greeting: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: "#006064",
    marginBottom: Spacing.xs,
  },
  subtext: {
    fontSize: FontSizes.xs,
    color: Colors.text,
    lineHeight: 18,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.background,
  },
});
