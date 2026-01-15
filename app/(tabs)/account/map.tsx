import Header from "@/components/ui/Header";
import { Spacing } from "@/constants/colors";
import * as Location from "expo-location";
import { LocateFixed } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";

const { width } = Dimensions.get("window");

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const INITIAL_REGION: Region = {
    latitude: 40.7128,
    longitude: -74.006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
      }
    })();
  }, []);

  const handleRecenter = async () => {
    if (!locationPermission) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Allow location access to find your position."
        );
        return;
      }
      setLocationPermission(true);
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const region: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current?.animateToRegion(region, 500);
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Map" showBackButton />

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          showsUserLocation={locationPermission}
          showsMyLocationButton={false}
        />

        {/* Custom Recenter Button (FAB) */}
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            onPress={handleRecenter}
            activeOpacity={0.8}
          >
            <LocateFixed size={24} color="#006D77" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    width,
    height: "100%",
  },
  fabContainer: {
    position: "absolute",
    bottom: Spacing.xxl + Spacing.xl,
    right: Spacing.md,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
