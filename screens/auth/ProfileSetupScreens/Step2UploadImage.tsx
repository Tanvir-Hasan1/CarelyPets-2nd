import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import SVG files
import ChooseBtnSvg from "@/assets/images/icons/chooseBtn.svg";
import TouchToOpenSvg from "@/assets/images/icons/touchToOpen.svg";

interface Step2UploadImageProps {
  profileImage?: string;
  onImageSelected: (imageUri: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2UploadImage({
  profileImage,
  onImageSelected,
  onBack,
  onNext,
}: Step2UploadImageProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    profileImage || null
  );
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  };

  const handleOpenCamera = async () => {
    console.log("camera");

    // Check camera permission
    if (!cameraPermission?.granted) {
      const permissionResponse = await requestCameraPermission();
      if (!permissionResponse.granted) {
        alert("Camera permission is required to take photos");
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images", // FIXED: Use string literal instead of MediaTypeOptions
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        const imageUri = result.assets[0].uri;
        setPreviewImage(imageUri);
        onImageSelected(imageUri);
      }
    } catch (error) {
      console.error("Error opening camera:", error);
      alert("Failed to open camera. Please try again.");
    }
  };

  const handleChooseFromGallery = async () => {
    console.log("gallery");

    // Check gallery permission
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      alert("Gallery permission is required to select photos");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", // FIXED: Use string literal instead of MediaTypeOptions
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        const imageUri = result.assets[0].uri;
        setPreviewImage(imageUri);
        onImageSelected(imageUri);
      }
    } catch (error) {
      console.error("Error opening gallery:", error);
      alert("Failed to open gallery. Please try again.");
    }
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar with Step Indicator */}
      <View style={styles.topBar}>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>2 OUT OF 3</Text>
        </View>
        <TouchableOpacity style={styles.cornerButton}>
          <Text style={styles.cornerButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Upload your Image</Text>
        <Text style={styles.subtitle}>
          Upload your own photo, so that other can easily recognize you.
        </Text>
      </View>

      {/* Image Preview Section */}
      {previewImage ? (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Image Preview</Text>
          <View style={styles.imagePreview}>
            <Image
              source={{ uri: previewImage }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                setPreviewImage(null);
                onImageSelected("");
              }}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View style={styles.imageUploadContainer}>
        {/* Touch to Open Camera Box */}
        <TouchableOpacity
          style={styles.touchToOpenBox}
          onPress={handleOpenCamera}
          activeOpacity={0.8}
        >
          <View style={styles.touchToOpenContent}>
            <TouchToOpenSvg width={300} height={120} />
          </View>
        </TouchableOpacity>

        {/* Choose from Gallery Button */}
        <TouchableOpacity
          style={styles.chooseGalleryButton}
          onPress={handleChooseFromGallery}
          activeOpacity={0.8}
        >
          <View style={styles.chooseGalleryContent}>
            <ChooseBtnSvg width={200} height={60} />
          </View>
        </TouchableOpacity>
        <View style={styles.fileFormatContainer}>
          <Text style={styles.fileFormatText}>JPEG, or PNG</Text>
        </View>
      </View>

      {/* Back and Next Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={onBack}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {previewImage ? "Next" : "Skip"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    justifyContent: "center",
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
    marginTop: Platform.OS === "ios" ? Spacing.md : Spacing.lg,
  },
  stepIndicator: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
  },
  stepText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  cornerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  cornerButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  previewContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  previewTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: Colors.primary,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 72,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  removeButtonText: {
    color: Colors.background,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    lineHeight: 28,
  },
  imageUploadContainer: {
    borderColor: "#c4c2c2ff",
    borderWidth: 3,
    borderStyle: "dashed",
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  touchToOpenBox: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  touchToOpenContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  chooseGalleryButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    overflow: "hidden",
  },
  chooseGalleryContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  fileFormatContainer: {
    marginTop: Spacing.sm,
  },
  fileFormatText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderRadius: BorderRadius.md,
  },
  backButton: {
    backgroundColor: Colors.lightGray,
    marginRight: Spacing.sm,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  nextButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
});
