// app/screens/ProfileSetupScreen.tsx

import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { ProfileData } from "@/types/profileSetup";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Step1PersonalInfo from "./ProfileSetupScreens/Setp1PersonalInfo";
import Step2UploadImage from "./ProfileSetupScreens/Step2UploadImage";
import Step3FavoritePets from "./ProfileSetupScreens/Step3FavoritePets";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { completeProfile, isLoading, error } = useAuthStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    country: "",
    profileImage: undefined,
    favoritePets: [],
  });

  const updateStep1Data = (data: {
    username: string;
    country: string;
  }) => {
    setProfileData({ ...profileData, ...data });
  };

  const updateProfileImage = (imageUri: string) => {
    setProfileData({ ...profileData, profileImage: imageUri });
  };

  const updateFavoritePets = (pets: string[]) => {
    setProfileData({ ...profileData, favoritePets: pets });
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const handleComplete = async () => {
    const success = await completeProfile({
      username: profileData.username,
      country: profileData.country,
      favorites: profileData.favoritePets,
      profileImage: profileData.profileImage,
    });

    if (success) {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {step === 1 && (
        <Step1PersonalInfo
          data={{
            username: profileData.username,
            country: profileData.country,
          }}
          onChange={updateStep1Data}
          onNext={handleNextStep}
        />
      )}
      {step === 2 && (
        <Step2UploadImage
          profileImage={profileData.profileImage}
          onImageSelected={updateProfileImage}
          onBack={handleBackStep}
          onNext={handleNextStep}
        />
      )}
      {step === 3 && (
        <Step3FavoritePets
          favoritePets={profileData.favoritePets}
          onPetsChange={updateFavoritePets}
          onBack={handleBackStep}
          onComplete={handleComplete}
        />
      )}

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  errorContainer: {
    backgroundColor: "#FFE0E0",
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.md,
    zIndex: 1000,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    textAlign: "center",
  },
});
