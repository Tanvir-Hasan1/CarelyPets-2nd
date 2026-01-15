import { Colors, Spacing } from "@/constants/colors";
import { CallIcon, Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface MapSheetContentProps {
  photos?: PlacePhoto[];
  address?: string;
  phoneNumber?: string;
  website?: string;
  apiKey: string;
  onPhotoPress: (photoUrl: string) => void;
  onCall: () => void;
  onWebsite: () => void;
}

export default function MapSheetContent({
  photos,
  address,
  phoneNumber,
  website,
  apiKey,
  onPhotoPress,
  onCall,
  onWebsite,
}: MapSheetContentProps) {
  return (
    <View style={styles.content}>
      {photos?.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled
          nestedScrollEnabled
        >
          {photos.map((item) => (
            <TouchableOpacity
              key={item.photo_reference}
              onPress={() =>
                onPhotoPress(
                  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${item.photo_reference}&key=${apiKey}`
                )
              }
            >
              <Image
                style={styles.galleryImage}
                contentFit="cover"
                source={{
                  uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${apiKey}`,
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}

      <View style={styles.detailItem}>
        <HugeiconsIcon icon={Location01Icon} size={20} color={Colors.primary} />
        <Text style={styles.detailText}>{address}</Text>
      </View>

      {phoneNumber && (
        <TouchableOpacity style={styles.detailItem} onPress={onCall}>
          <HugeiconsIcon icon={CallIcon} size={20} color={Colors.primary} />
          <Text style={styles.detailText}>{phoneNumber}</Text>
        </TouchableOpacity>
      )}

      {website && (
        <TouchableOpacity style={styles.detailItem} onPress={onWebsite}>
          <HugeiconsIcon
            icon={Location01Icon}
            size={20}
            color={Colors.primary}
          />
          <Text style={[styles.detailText, { color: Colors.primary }]}>
            {website}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.lg },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  detailText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 15,
  },
});
