import MapBottomSheet from "@/components/accounts/map/MapBottomSheet";
import MapFAB from "@/components/accounts/map/MapFAB";
import MapLegend from "@/components/accounts/map/MapLegend";
import MapSearch from "@/components/accounts/map/MapSearch";
import Header from "@/components/ui/Header";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Text as RNText,
  StyleSheet,
  View,
} from "react-native";
import MapView, {
  Marker,
  Polygon,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

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
  category?: "vet" | "store" | "search";
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(
    null
  );
  const [nearbyPlaces, setNearbyPlaces] = useState<SelectedPlace[]>([]);
  const [nearbyParks, setNearbyParks] = useState<any[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState<boolean>(false);
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const MAP_STYLE = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

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
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        fetchNearbyPlaces(latitude, longitude);
        fetchNearbyParks(latitude, longitude);
      }
    })();
  }, []);

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    setIsLoadingNearby(true);
    console.log(`Fetching nearby places for: ${lat}, ${lng}`);

    if (!googleMapsApiKey) {
      console.error("Google Maps API Key is missing!");
      setIsLoadingNearby(false);
      return;
    }

    try {
      // Types: veterinary_care, pet_store (covers feed and services)
      const types = ["veterinary_care", "pet_store"];
      const radius = 5000; // 5km

      const allResults: SelectedPlace[] = [];

      for (const type of types) {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${googleMapsApiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        console.log(`Places API response for ${type}:`, data.status);

        if (data.status === "OK") {
          const places = data.results.map((item: any) => ({
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
            title: item.name,
            address: item.vicinity,
            rating: item.rating,
            userRatingsTotal: item.user_ratings_total,
            photos: item.photos,
            isOpen: item.opening_hours?.open_now,
            placeId: item.place_id, // Added to fetch full details if needed
            category: type === "veterinary_care" ? "vet" : "store",
          }));
          allResults.push(...places);
        } else if (data.status === "ZERO_RESULTS") {
          console.log(`No results found for ${type}`);
        } else {
          console.error(
            `Places API Error (${type}):`,
            data.error_message || data.status
          );
        }
      }

      // Remove duplicates based on latitude/longitude or title
      const uniquePlaces = allResults.filter(
        (place, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.latitude === place.latitude && t.longitude === place.longitude
          )
      );

      setNearbyPlaces(uniquePlaces);
    } catch (error) {
      console.error("Fetch nearby error:", error);
    } finally {
      setIsLoadingNearby(false);
    }
  };

  const fetchNearbyParks = async (lat: number, lng: number) => {
    try {
      const radius = 5000; // 5km
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=park&key=${googleMapsApiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log(`Parks API response:`, data.status);

      if (data.status === "OK") {
        // Fetch detailed geometry for each park
        const parksWithGeometry = await Promise.all(
          data.results.slice(0, 10).map(async (park: any) => {
            try {
              const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${park.place_id}&fields=geometry&key=${googleMapsApiKey}`;
              const detailsResponse = await fetch(detailsUrl);
              const detailsData = await detailsResponse.json();

              if (detailsData.status === "OK" && detailsData.result.geometry) {
                return {
                  name: park.name,
                  placeId: park.place_id,
                  location: park.geometry.location,
                  viewport: detailsData.result.geometry.viewport,
                };
              }
            } catch (error) {
              console.error(`Error fetching park details:`, error);
            }
            return null;
          })
        );

        setNearbyParks(parksWithGeometry.filter((p) => p !== null));
      }
    } catch (error) {
      console.error("Fetch parks error:", error);
    }
  };

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
      fetchNearbyPlaces(latitude, longitude);
      fetchNearbyParks(latitude, longitude);
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const fetchPlaceDetails = async (placeId: string, description: string) => {
    try {
      const fields =
        "geometry,formatted_address,name,rating,user_ratings_total,photos,opening_hours,formatted_phone_number,website";
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${googleMapsApiKey}`;
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
          title: result.name || description,
          address: result.formatted_address,
          rating: result.rating,
          userRatingsTotal: result.user_ratings_total,
          photos: result.photos,
          isOpen: result.opening_hours?.open_now,
          phoneNumber: result.formatted_phone_number,
          website: result.website,
          category: "search",
        });

        mapRef.current?.animateToRegion(region, 1000);
        setIsSearchVisible(false);
      }
    } catch (error) {
      console.error("Place details error:", error);
      Alert.alert("Error", "Could not fetch place details.");
    }
  };

  const handlePlaceSelect = async (place: {
    place_id: string;
    description: string;
  }) => {
    await fetchPlaceDetails(place.place_id, place.description);
  };

  const handlePoiClick = async (event: any) => {
    const { placeId, name } = event.nativeEvent;
    if (placeId) {
      await fetchPlaceDetails(placeId, name);
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
          onPoiClick={handlePoiClick}
          customMapStyle={MAP_STYLE}
        >
          {/* Park boundaries */}
          {nearbyParks.map((park, index) => {
            if (!park?.viewport) return null;

            const { northeast, southwest } = park.viewport;
            const coordinates = [
              { latitude: northeast.lat, longitude: northeast.lng },
              { latitude: northeast.lat, longitude: southwest.lng },
              { latitude: southwest.lat, longitude: southwest.lng },
              { latitude: southwest.lat, longitude: northeast.lng },
            ];

            return (
              <Polygon
                key={`park-${park.placeId}-${index}`}
                coordinates={coordinates}
                strokeColor="#22C55E"
                strokeWidth={3}
                fillColor="rgba(34, 197, 94, 0.15)"
              />
            );
          })}

          {/* Park name labels */}
          {nearbyParks.map((park, index) => {
            if (!park?.location) return null;

            return (
              <Marker
                key={`park-label-${park.placeId}-${index}`}
                coordinate={{
                  latitude: park.location.lat,
                  longitude: park.location.lng,
                }}
                title={park.name}
                description="Pet-friendly walking area"
              >
                <View style={styles.parkLabel}>
                  <RNText style={styles.parkLabelText}>🌳 {park.name}</RNText>
                </View>
              </Marker>
            );
          })}

          {nearbyPlaces.map((place, index) => (
            <Marker
              key={`${place.latitude}-${place.longitude}-${index}`}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.title}
              description={place.address}
              onPress={() => setSelectedPlace(place)}
              pinColor={place.category === "vet" ? "#EF4444" : "#F59E0B"}
            />
          ))}
          {selectedPlace && (
            <Marker
              coordinate={{
                latitude: selectedPlace.latitude,
                longitude: selectedPlace.longitude,
              }}
              title={selectedPlace.title}
              description={selectedPlace.address}
              pinColor="#3B82F6"
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
        <MapLegend />
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
  parkLabel: {
    backgroundColor: "rgba(34, 197, 94, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  parkLabelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
