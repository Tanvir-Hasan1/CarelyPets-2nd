// app/screens/ProfileSetupScreen.tsx

import { ProfileData } from "@/app/types/profileSetup";
import React, { useState } from "react";
import Step1PersonalInfo from "./ProfileSetupScreens/Setp1PersonalInfo";
import Step2UploadImage from "./ProfileSetupScreens/Step2UploadImage";
import Step3FavoritePets from "./ProfileSetupScreens/Step3FavoritePets";

export default function ProfileSetupScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    username: "",
    country: "",
    profileImage: undefined,
    favoritePets: [],
  });

  const updateStep1Data = (data: {
    name: string;
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

  const handleComplete = () => {
    // Save profile data and navigate to home
    console.log("Profile completed:", profileData);
    // Navigate to home or dashboard
    // router.replace("/(tabs)");
  };

  return (
    <>
      {step === 1 && (
        <Step1PersonalInfo
          data={{
            name: profileData.name,
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
    </>
  );
}
