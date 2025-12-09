import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface Onboarding4ScreenProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const Onboarding4Screen: React.FC<Onboarding4ScreenProps> = ({
  onNext,
  onPrevious,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/onboarding/onboarding4.png")}
          style={styles.image}
          defaultSource={require("@/assets/images/logos/placeholder.png")}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Smart Care Management</Text>
        <Text style={styles.description}>
          Upload records, schedule appointments, and get notifications for
          everything.
        </Text>

        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonGetStarted} onPress={onNext}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "space-between",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: height * 0.5,
    resizeMode: "stretch",
  },
  contentContainer: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    justifyContent: "space-between",
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  buttonGetStarted: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  buttonBack: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
});
