import HomeScreen from "@/screens/tabs/HomeScreen";
import { useProfileStore } from "@/store/useProfileStore";
import { useEffect } from "react";

const HomeScreenWrapper = () => {
  const fetchAllProfileData = useProfileStore(
    (state) => state.fetchAllProfileData,
  );

  useEffect(() => {
    fetchAllProfileData();
  }, []);

  return <HomeScreen />;
};

export default HomeScreenWrapper;
