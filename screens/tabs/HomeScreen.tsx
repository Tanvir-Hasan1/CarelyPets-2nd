import AdoptionList from "@/components/home/AdoptionList";
import HomeHeader from "@/components/home/HomeHeader";
import PetList from "@/components/home/PetList";
import PetPalsList from "@/components/home/PetPalsList";
import QuickActions from "@/components/home/QuickActions";
import SectionHeader from "@/components/home/SectionHeader";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import { Colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <HomeHeader />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ... content ... */}
        <WelcomeBanner />

        <QuickActions />

        <SectionHeader title="My Pets" onSeeAll={() => router.push("/home/myPets/all-pets")} />
        <PetList />

        <SectionHeader title="Pet Pals" onSeeAll={() => console.log("See All My Pets")} />
        <PetPalsList />

        <SectionHeader title="Available for Adoption" onSeeAll={() => console.log("See All Adoptions")} />
        <AdoptionList />

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
});
