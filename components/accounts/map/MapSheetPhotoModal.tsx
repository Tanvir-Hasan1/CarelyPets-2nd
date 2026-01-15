import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image } from "expo-image";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface MapSheetPhotoModalProps {
  visible: boolean;
  photoUrl: string | null;
  onClose: () => void;
}

export default function MapSheetPhotoModal({
  visible,
  photoUrl,
  onClose,
}: MapSheetPhotoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <HugeiconsIcon icon={Cancel01Icon} size={28} color="#FFF" />
        </TouchableOpacity>
        {photoUrl && (
          <Image
            source={{ uri: photoUrl }}
            style={styles.fullImage}
            contentFit="contain"
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
