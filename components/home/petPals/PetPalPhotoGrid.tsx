import { Spacing } from "@/constants/colors";
import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PetPalImageModal from "./PetPalImageModal";

interface PhotoData {
  uri: string;
  userName: string;
  dateText: string;
  caption: string;
  likesCount: string;
  commentsCount: string;
  sharesCount: string;
}

interface PetPalPhotoGridProps {
  photos: PhotoData[];
}

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = Math.floor((width - Spacing.lg * 2 - 20) / 3);

const PetPalPhotoGrid = ({ photos }: PetPalPhotoGridProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const fallbackImage =
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop";

  if (!photos || photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No photos yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photos.map((photo, index) => (
        <TouchableOpacity
          key={index}
          style={styles.photoWrapper}
          onPress={() => setSelectedPhoto(photo)}
        >
          <Image
            source={{ uri: photo.uri || fallbackImage }}
            style={styles.photo}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ))}

      {selectedPhoto && (
        <PetPalImageModal
          visible={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          imageUri={selectedPhoto.uri}
          userName={selectedPhoto.userName}
          dateText={selectedPhoto.dateText}
          caption={selectedPhoto.caption}
          likesCount={selectedPhoto.likesCount}
          commentsCount={selectedPhoto.commentsCount}
          sharesCount={selectedPhoto.sharesCount}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  photoWrapper: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH,
    marginRight: 10,
    marginBottom: 10,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    width: "100%",
  },
  emptyText: {
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});

export default PetPalPhotoGrid;
