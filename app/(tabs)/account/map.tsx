import MapBottomSheet from "@/components/accounts/map/MapBottomSheet";
import MapFAB from "@/components/accounts/map/MapFAB";
import MapSearch from "@/components/accounts/map/MapSearch";
import Header from "@/components/ui/Header";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

const { width } = Dimensions.get("window");

interface SelectedPlace {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
  rating?: number;
  userRatingsTotal?: number;
  photos?: any[];
  isOpen?: boolean;
  phoneNumber?: string;
  website?: string;
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null
  );
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

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

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handlePlaceSelect = async (place: {
    place_id: string;
    description: string;
  }) => {
    try {
      const fields =
        "geometry,formatted_address,name,rating,user_ratings_total,photos,opening_hours,formatted_phone_number,website";
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=${fields}&key=${googleMapsApiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const result = data.result;
        const { lat, lng } = result.geometry.location;
        const region: Region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setSelectedPlace({
          latitude: lat,
          longitude: lng,
          title: result.name || place.description,
          address: result.formatted_address,
          rating: result.rating,
          userRatingsTotal: result.user_ratings_total,
          photos: result.photos,
          isOpen: result.opening_hours?.open_now,
          phoneNumber: result.formatted_phone_number,
          website: result.website,
        });

        mapRef.current?.animateToRegion(region, 1000);
        setIsSearchVisible(false);
      }
    } catch (error) {
      console.error("Place details error:", error);
      Alert.alert("Error", "Could not fetch place details.");
    }
  };

  const handleCloseBottomSheet = () => {
    setSelectedPlace(null);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Map"
        showBackButton
        showSearch
        showBasket={false}
        showNotifications={false}
        onSearchPress={toggleSearch}
      />

      <View style={styles.mapContainer}>
        {isSearchVisible && <MapSearch onPlaceSelect={handlePlaceSelect} />}
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          showsUserLocation={locationPermission}
          showsMyLocationButton={false}
        >
          {selectedPlace && (
            <Marker
              coordinate={{
                latitude: selectedPlace.latitude,
                longitude: selectedPlace.longitude,
              }}
              title={selectedPlace.title}
            />
          )}
        </MapView>

        {selectedPlace && (
          <MapBottomSheet
            title={selectedPlace.title}
            address={selectedPlace.address}
            rating={selectedPlace.rating}
            userRatingsTotal={selectedPlace.userRatingsTotal}
            photos={selectedPlace.photos}
            isOpen={selectedPlace.isOpen}
            phoneNumber={selectedPlace.phoneNumber}
            website={selectedPlace.website}
            onClose={handleCloseBottomSheet}
            apiKey={googleMapsApiKey}
          />
        )}

        <MapFAB onPress={handleRecenter} />
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
});
