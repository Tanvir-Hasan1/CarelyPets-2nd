import Header from "@/components/ui/Header";
import LoadingModal from "@/components/ui/LoadingModal";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { Pet, usePetStore } from "@/store/usePetStore";
import {
  Add01Icon,
  ArrowDown01Icon,
  Camera01Icon,
  Cancel01Icon,
  MultiplicationSignIcon,
  PencilEdit02Icon,
  Upload02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Reusable Components
const SectionLabel = ({ title }: { title: string }) => (
  <Text style={styles.sectionLabel}>{title}</Text>
);

const RadioGroup = <T extends string | boolean>({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; value: T }[];
  selected: T;
  onSelect: (val: T) => void;
}) => (
  <View style={styles.radioGroup}>
    {options.map((opt) => (
      <TouchableOpacity
        key={String(opt.value)}
        style={styles.radioItem}
        onPress={() => onSelect(opt.value)}
      >
        <View style={styles.radioCircle}>
          {selected === opt.value && <View style={styles.radioInnerCircle} />}
        </View>
        <Text style={styles.radioText}>{opt.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

// Custom Selection Modal Component
const SelectionModal = ({
  visible,
  onClose,
  title,
  options,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  onSelect: (val: string) => void;
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.modalItem}
              onPress={() => {
                onSelect(opt);
                onClose();
              }}
            >
              <Text style={styles.modalItemText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const AvatarSelectionModal = ({
  visible,
  onClose,
  onCamera,
  onGallery,
}: {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Update Profile Photo</Text>
          <TouchableOpacity onPress={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarOptions}>
          <TouchableOpacity
            style={styles.avatarOptionItem}
            onPress={() => {
              onCamera();
              onClose();
            }}
          >
            <View style={styles.avatarOptionIcon}>
              <HugeiconsIcon icon={Camera01Icon} size={24} color="#006064" />
            </View>
            <Text style={styles.avatarOptionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarOptionItem}
            onPress={() => {
              onGallery();
              onClose();
            }}
          >
            <View style={styles.avatarOptionIcon}>
              <HugeiconsIcon icon={ViewIcon} size={24} color="#006064" />
            </View>
            <Text style={styles.avatarOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const DropdownInput = ({
  placeholder,
  value,
  onPress,
}: {
  placeholder: string;
  value: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.dropdownButton} onPress={onPress}>
    <Text
      style={[styles.dropdownText, !value && { color: Colors.placeholder }]}
    >
      {value || placeholder}
    </Text>
    <HugeiconsIcon
      icon={ArrowDown01Icon}
      size={20}
      color={Colors.textSecondary}
    />
  </TouchableOpacity>
);

export default function EditPetScreen({ initialData }: { initialData: Pet }) {
  console.log(
    "[EditPetScreen] initialData:",
    JSON.stringify(initialData, null, 2)
  );

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const updatePet = usePetStore((state) => state.updatePet);
  const isLoading = usePetStore((state) => state.isLoading);

  const [avatar, setAvatar] = useState<string | null>(
    initialData.avatarUrl || initialData.image || null
  );
  const [name, setName] = useState(initialData.name);
  const [type, setType] = useState(initialData.type);
  const [breed, setBreed] = useState(initialData.breed);
  const [age, setAge] = useState(String(initialData.age || ""));
  const [weight, setWeight] = useState(
    initialData.weight || String(initialData.weightLbs || "")
  );
  const [gender, setGender] = useState<"male" | "female">(
    initialData.gender?.toLowerCase() === "female" ? "female" : "male"
  );
  const [trained, setTrained] = useState(initialData.trained);
  const [vaccinated, setVaccinated] = useState(initialData.vaccinated);
  const [neutered, setNeutered] = useState(initialData.neutered);
  const [traitInput, setTraitInput] = useState("");

  // Parse personality/traits - handle both JSON string and array formats
  const parsePersonality = (data: any): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const [traits, setTraits] = useState<string[]>(() => {
    const personalityData = initialData.personality || initialData.traits;
    console.log("[EditPetScreen] Raw personality data:", personalityData);
    console.log("[EditPetScreen] Type:", typeof personalityData);

    const parsed = parsePersonality(personalityData);
    console.log("[EditPetScreen] Parsed traits:", parsed);

    return parsed;
  });
  const [about, setAbout] = useState(
    initialData.bio || initialData.about || ""
  );
  const [snaps, setSnaps] = useState<ImagePicker.ImagePickerAsset[]>(
    (initialData.photos || initialData.snaps)?.map((uri) => ({
      uri,
      width: 0,
      height: 0,
      assetId: null,
      base64: null,
      exif: null,
      fileName: uri.split("/").pop() || "Existing Image",
      fileSize: 0,
      mimeType: "image/jpeg",
    })) || []
  );
  const [viewedImage, setViewedImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Modal State
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [breedModalVisible, setBreedModalVisible] = useState(false);

  // Mock Options
  const PET_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Other"];
  const DOG_BREEDS = [
    "Golden Retriever",
    "German Shepherd",
    "Bulldog",
    "Poodle",
    "Labrador",
    "Beagle",
    "Husky",
    "Mixed",
  ];
  const CAT_BREEDS = [
    "Persian",
    "Maine Coon",
    "Siamese",
    "Ragdoll",
    "Bengal",
    "Sphynx",
    "Mixed",
  ];

  const getBreeds = () => {
    if (type === "Dog") return DOG_BREEDS;
    if (type === "Cat") return CAT_BREEDS;
    return ["Mixed", "Unknown", "Other"];
  };

  const pickImage = async () => {
    if (snaps.length >= 3) {
      alert("You can upload a maximum of 3 snaps.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSnaps([...snaps, result.assets[0]]);
    }
  };

  const pickAvatarFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const pickAvatarFromCamera = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your camera!");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error launching camera:", error);
    }
  };

  const removeSnap = (index: number) => {
    setSnaps(snaps.filter((_, i) => i !== index));
  };

  const handleAddTrait = () => {
    if (traitInput.trim() && traits.length < 5) {
      setTraits([...traits, traitInput.trim()]);
      setTraitInput("");
    }
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Basic validation
    if (!name) {
      alert("Please enter a pet name");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", initialData.id);
      formData.append("name", name);
      formData.append("type", type);
      formData.append("species", type);
      formData.append("breed", breed);
      formData.append("age", age);
      formData.append("weightLbs", weight);
      formData.append("gender", gender);
      formData.append("trained", JSON.stringify(trained));
      formData.append("vaccinated", JSON.stringify(vaccinated));
      formData.append("neutered", JSON.stringify(neutered));
      formData.append("personality", JSON.stringify(traits));
      formData.append("bio", about);
      formData.append("about", about);

      console.log("[EditPetScreen] FormData entries:");
      // @ts-ignore
      if (formData._parts) {
        // @ts-ignore
        formData._parts.forEach(([key, value]) => {
          console.log(
            `[EditPetScreen] ${key}:`,
            typeof value === "object" ? "[File/Object]" : value
          );
        });
      }

      // Append Avatar if it's new (has file:// scheme)
      if (avatar && avatar.startsWith("file://")) {
        const filename = avatar.split("/").pop() || "avatar.jpg";
        const fileType = `image/${filename.split(".").pop() || "jpeg"}`;

        formData.append("avatar", {
          uri:
            Platform.OS === "android" ? avatar : avatar.replace("file://", ""),
          name: filename,
          type: fileType,
        } as any);

        console.log("[EditPetScreen] Adding avatar file:", filename);
      }

      // Append new image files (snaps with file:// scheme)
      const newFiles = snaps.filter((snap) => snap.uri.startsWith("file://"));
      newFiles.forEach((snap, index) => {
        const filename = snap.uri.split("/").pop() || `snap_${index}.jpg`;
        const fileType = `image/${filename.split(".").pop() || "jpeg"}`;

        formData.append("files", {
          uri:
            Platform.OS === "android"
              ? snap.uri
              : snap.uri.replace("file://", ""),
          name: filename,
          type: fileType,
        } as any);

        console.log(`[EditPetScreen] Adding file ${index + 1}:`, filename);
      });

      console.log(`[EditPetScreen] Total new files: ${newFiles.length}`);
      console.log(`[EditPetScreen] Updating pet with ID: ${initialData.id}`);

      const result = await updatePet(formData);
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.back();
        }, 2000);
      } else {
        alert(result.message || "Failed to update pet");
      }
    } catch (error: any) {
      console.error("Update pet error:", error);
      alert("An error occurred while updating pet information.");
    }
  };

  return (
    <>
      {/* Loading Modal */}
      <LoadingModal
        visible={isLoading || showSuccess}
        message="Updating pet information..."
        success={showSuccess}
        successMessage="Pet updated successfully!"
      />

      {/* Main Content */}
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {/* Header */}
        <Header title="Edit Pet Facts" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar Selection */}
            <View style={styles.avatarContainer}>
              <TouchableOpacity
                style={styles.avatarButton}
                onPress={() => setAvatarModalVisible(true)}
              >
                {avatar ? (
                  <View>
                    <Image
                      source={{ uri: avatar }}
                      style={styles.avatarImage}
                    />
                    <View style={styles.editIconBadge}>
                      <HugeiconsIcon
                        icon={PencilEdit02Icon}
                        size={14}
                        color="#ffffff"
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <HugeiconsIcon
                      icon={Camera01Icon}
                      size={32}
                      color={Colors.primary}
                    />
                    <View style={styles.addIconBadge}>
                      <HugeiconsIcon
                        icon={Add01Icon}
                        size={12}
                        color="#ffffff"
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.avatarLabel}>Update Profile Photo</Text>
            </View>

            {/* Pet Snaps */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>Pet Snaps</Text>
                  <Text style={styles.sectionSubtitle}>
                    (You can upload maximum 3 snaps)
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickImage}
                >
                  <HugeiconsIcon
                    icon={Upload02Icon}
                    size={16}
                    color="#006064"
                  />
                  <Text style={styles.uploadButtonText}>Upload snaps</Text>
                </TouchableOpacity>
              </View>

              {snaps.map((snap, i) => (
                <View key={i} style={styles.fileItem}>
                  <Image source={{ uri: snap.uri }} style={styles.fileIcon} />
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>
                      {snap.fileName || `Snap ${i + 1}`}
                    </Text>
                    <Text style={styles.fileType}>
                      {snap.mimeType || "image/jpeg"} •{" "}
                      {snap.fileSize
                        ? (snap.fileSize / 1024).toFixed(0) + "KB"
                        : "Unknown size"}
                    </Text>
                  </View>
                  <View style={styles.fileActions}>
                    <TouchableOpacity onPress={() => setViewedImage(snap.uri)}>
                      <HugeiconsIcon
                        icon={ViewIcon}
                        size={20}
                        color={Colors.textSecondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeSnap(i)}>
                      <HugeiconsIcon
                        icon={MultiplicationSignIcon}
                        size={20}
                        color={Colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Pet Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pet Information</Text>

              <SectionLabel title="NAME" />
              <TextInput
                style={styles.input}
                placeholder="Pet name"
                placeholderTextColor={Colors.placeholder}
                value={name}
                onChangeText={setName}
              />

              <SectionLabel title="TYPE" />
              <DropdownInput
                placeholder="Pet type"
                value={type}
                onPress={() => setTypeModalVisible(true)}
              />

              <SectionLabel title="BREED" />
              <DropdownInput
                placeholder="Choose breed"
                value={breed}
                onPress={() => setBreedModalVisible(true)}
              />

              <SelectionModal
                visible={typeModalVisible}
                onClose={() => setTypeModalVisible(false)}
                title="Select Pet Type"
                options={PET_TYPES}
                onSelect={(val) => {
                  if (val !== type) {
                    setType(val);
                    setBreed("");
                  }
                }}
              />

              <SelectionModal
                visible={breedModalVisible}
                onClose={() => setBreedModalVisible(false)}
                title="Select Breed"
                options={getBreeds()}
                onSelect={setBreed}
              />

              <AvatarSelectionModal
                visible={avatarModalVisible}
                onClose={() => setAvatarModalVisible(false)}
                onCamera={pickAvatarFromCamera}
                onGallery={pickAvatarFromGallery}
              />

              {/* Image Preview Modal */}
              <Modal
                visible={!!viewedImage}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setViewedImage(null)}
              >
                <View style={styles.previewModalOverlay}>
                  <TouchableOpacity
                    style={styles.previewCloseButton}
                    onPress={() => setViewedImage(null)}
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size={32}
                      color="#ffffff"
                    />
                  </TouchableOpacity>
                  {viewedImage && (
                    <Image
                      source={{ uri: viewedImage }}
                      style={styles.previewImage}
                      resizeMode="contain"
                    />
                  )}
                </View>
              </Modal>

              <View style={styles.row}>
                <View style={[styles.flex1, { marginRight: Spacing.sm }]}>
                  <SectionLabel title="YEAR" />
                  <TextInput
                    style={styles.input}
                    placeholder="Pet age"
                    placeholderTextColor={Colors.placeholder}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.flex1, { marginLeft: Spacing.sm }]}>
                  <SectionLabel title="WEIGHT (lbs)" />
                  <TextInput
                    style={styles.input}
                    placeholder="Pet weight"
                    placeholderTextColor={Colors.placeholder}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <SectionLabel title="GENDER" />
              <RadioGroup
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
                selected={gender}
                onSelect={(val) => setGender(val as any)}
              />

              <SectionLabel title="TRAINED" />
              <RadioGroup
                options={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                selected={trained}
                onSelect={setTrained}
              />

              <SectionLabel title="VACCINATED" />
              <RadioGroup
                options={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                selected={vaccinated}
                onSelect={setVaccinated}
              />

              <SectionLabel title="NEUTERED" />
              <RadioGroup
                options={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                selected={neutered}
                onSelect={setNeutered}
              />

              <SectionLabel title="PERSONALITY (max 5)" />
              <View style={styles.traitInputRow}>
                <TextInput
                  style={[styles.input, styles.flex1]}
                  placeholder="Type trait and press add"
                  placeholderTextColor={Colors.placeholder}
                  value={traitInput}
                  onChangeText={setTraitInput}
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddTrait}
                >
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={20}
                    color={Colors.text}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.traitsContainer}>
                {traits.map((t, index) => (
                  <View key={index} style={styles.traitChip}>
                    <Text style={styles.traitText}>{t}</Text>
                    <TouchableOpacity onPress={() => removeTrait(index)}>
                      <HugeiconsIcon
                        icon={MultiplicationSignIcon}
                        size={14}
                        color={Colors.text}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <SectionLabel title="ABOUT PET" />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write about your pet"
                placeholderTextColor={Colors.placeholder}
                value={about}
                onChangeText={setAbout}
                multiline
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Light gray background from image
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: "#006064",
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  iconButton: {
    padding: Spacing.xs,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B2EBF2",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  uploadButtonText: {
    fontSize: FontSizes.xs,
    color: "#006064",
    fontWeight: FontWeights.medium,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  fileIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#E1BEE7", // Light purple
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  fileType: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  fileActions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  row: {
    flexDirection: "row",
  },
  flex1: {
    flex: 1,
  },
  radioGroup: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.xs,
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00BCD4", // Cyan
  },
  radioText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  traitInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  addButton: {
    backgroundColor: "#B2EBF2",
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
  },
  traitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  traitChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  traitText: {
    fontSize: FontSizes.xs,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  footer: {
    paddingVertical: Spacing.lg,
    backgroundColor: "#F8F9FA",
    flexDirection: "row",
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: "#EEEEEE",
    borderRadius: BorderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cancelText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: "#00BCD4",
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  saveText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: "#ffffff",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  dropdownText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.lg,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  modalList: {
    marginBottom: Spacing.xl,
  },
  modalItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalItemText: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  previewModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
    padding: Spacing.sm,
  },
  previewImage: {
    width: "100%",
    height: "80%",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatarButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E0F7FA", // Light cyan bg
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B2EBF2",
  },
  addIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00BCD4",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  avatarLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
  avatarOptions: {
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  avatarOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
  },
  avatarOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  avatarOptionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  editIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#00BCD4",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    minWidth: 200,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
});
