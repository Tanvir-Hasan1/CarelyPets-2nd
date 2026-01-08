import AdoptionList from "@/components/home/AdoptionList";
import PetList from "@/components/home/PetList";
import PetPalsList from "@/components/home/PetPalsList";
import QuickActions from "@/components/home/QuickActions";
import SectionHeader from "@/components/home/SectionHeader";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import Header from "@/components/ui/Header";
import { Colors } from "@/constants/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { usePetStore } from "@/store/usePetStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { RefreshControl, ScrollView, StatusBar, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { fetchUser, isLoading: isAuthLoading } = useAuthStore();
  const { fetchPets, isLoading: isPetsLoading } = usePetStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchUser(), fetchPets()]);
    setRefreshing(false);
  }, [fetchUser, fetchPets]);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Header isHome />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
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
    </View>
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
