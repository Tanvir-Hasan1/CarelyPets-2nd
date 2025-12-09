import GoogleIcon from "@/assets/images/icons/Google.svg";
import ClawHeader from "@/components/ui/ClawHeader";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface Onboarding5ScreenProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const Onboarding5Screen: React.FC<Onboarding5ScreenProps> = ({
  onNext,
  onPrevious,
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <ClawHeader />
      </View>

      <View style={styles.buttonsWrap}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("../login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => router.push("../signup")}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => console.log("Google auth placeholder")}
        >
          <GoogleIcon style={styles.googleIcon} width={28} height={28} />
          <Text style={styles.googleButtonText}>Continue With Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
  },
  topArea: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
    marginBottom: Spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
  },
  clawIcon: {
    marginRight: Spacing.md,
  },
  carelyTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold as any,
    color: Colors.primary,
  },
  buttonsWrap: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  loginButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold as any,
    color: Colors.background,
  },
  signupButton: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  signupButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold as any,
    color: Colors.text,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  googleIcon: {
    marginRight: Spacing.sm,
  },
  googleIconText: {
    color: Colors.primary,
    fontWeight: FontWeights.bold as any,
  },
  googleLogoText: {
    color: "#EA4335",
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold as any,
  },
  googleButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold as any,
    color: Colors.text,
  },
});

export default Onboarding5Screen;
