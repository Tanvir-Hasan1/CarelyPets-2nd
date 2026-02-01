import AdoptionList from "@/components/home/AdoptionList";
import PetList from "@/components/home/PetList";
import PetPalsList from "@/components/home/PetPalsList";
import QuickActions from "@/components/home/QuickActions";
import SectionHeader from "@/components/home/SectionHeader";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import Header from "@/components/ui/Header";
import { Colors } from "@/constants/colors";
import adoptionService, { AdoptionPet } from "@/services/adoptionService";
import userService, { PetPal } from "@/services/userService";
import { useAuthStore } from "@/store/useAuthStore";
import { usePetStore } from "@/store/usePetStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { user, fetchUser, isLoading: isAuthLoading } = useAuthStore();
  const { fetchPets, isLoading: isPetsLoading } = usePetStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const [adoptionPets, setAdoptionPets] = useState<AdoptionPet[]>([]);
  const [isAdoptionLoading, setIsAdoptionLoading] = useState(true);

  const [petPals, setPetPals] = useState<PetPal[]>([]);
  const [isPetPalsLoading, setIsPetPalsLoading] = useState(true);

  useEffect(() => {
    fetchPets();
    fetchAdoptions();
    fetchPetPals();
  }, []);

  const fetchPetPals = async () => {
    try {
      const response = await userService.getPetPals(1, 7); // Fetch first 7
      if (response.success) {
        setPetPals(response.data);
      }
    } catch (error) {
      console.error("Error fetching home pet pals:", error);
    } finally {
      setIsPetPalsLoading(false);
    }
  };

  const fetchAdoptions = async () => {
    try {
      const response = await adoptionService.getAdoptions({
        limit: 5,
        status: "available",
      });
      if (response.success) {
        setAdoptionPets(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching home adoption list:", error);
    } finally {
      setIsAdoptionLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setRefreshing(true);
    await Promise.all([
      fetchUser(),
      fetchPets(),
      fetchAdoptions(),
      fetchPetPals(),
    ]);
    console.log(
      "[HomeScreen] User Info on Refresh:",
      useAuthStore.getState().user,
    );
    setRefreshing(false);
  }, [fetchUser, fetchPets]);

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header isHome />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        {/* ... content ... */}
        <WelcomeBanner />

        <QuickActions />

        <SectionHeader
          title="My Pets"
          onSeeAll={() => router.push("/home/myPets/all-pets")}
        />
        <PetList />

        <SectionHeader
          title="Pet Pals"
          onSeeAll={() => router.push("/home/petPals/all-pals")}
        />
        <PetPalsList pals={petPals} isLoading={isPetPalsLoading} />

        <SectionHeader
          title="Available for Adoption"
          onSeeAll={() => router.push("/home/adopt-pet")}
        />
        <AdoptionList pets={adoptionPets} isLoading={isAdoptionLoading} />

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
