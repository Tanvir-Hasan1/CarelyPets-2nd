// app/screens/profileSetup/Step1PersonalInfo.tsx

import AtIcon from "@/assets/images/icons/at.svg";
import GlobeIcon from "@/assets/images/icons/globe.svg";
import CountrySelectModal from "@/components/ui/CountrySelectModal";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface Step1PersonalInfoProps {
  data: {

    username: string;
    country: string;
  };
  onChange: (data: { username: string; country: string }) => void;
  onNext: () => void;
}

// List of countries
const COUNTRIES = [
  "USA",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "India",
  "Brazil",
  "Mexico",
  "Spain",
  "Italy",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "South Korea",
  "Singapore",
  "China",
  "Russia",
  "South Africa",
  "Argentina",
  "Chile",
  "New Zealand",
  "Ireland",
  "Portugal",
  "Greece",
  "Turkey",
  "Egypt",
  "Saudi Arabia",
  "United Arab Emirates",
  "Thailand",
  "Vietnam",
  "Philippines",
  "Malaysia",
  "Indonesia",
  "Pakistan",
  "Bangladesh",
];

export default function Step1PersonalInfo({
  data,
  onChange,
  onNext,
}: Step1PersonalInfoProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<{ username?: string }>({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const validateUsername = (username: string) => {
    const regex = /^[a-z0-9._]+$/;
    if (!regex.test(username)) {
      return "Only lowercase letters, numbers, dots, and underscores are allowed";
    }
    return "";
  };

  const handleUsernameChange = (username: string) => {
    const error = validateUsername(username);
    setErrors({ username: error });
    onChange({ ...data, username });
  };

  const handleNext = () => {
    if (!data.username || !data.country) {
      alert("Please fill in all fields");
      return;
    }
    if (errors.username) {
      alert("Please fix the username errors");
      return;
    }
    onNext();
  };



  const handleSelectCountry = (country: string) => {
    onChange({ ...data, country });
    setShowCountryDropdown(false);
    setSearchQuery("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar with Step Indicator */}
        <View style={styles.topBar}>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>1 OUT OF 3</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Set Up Your Profile</Text>
          <Text style={styles.subtitle}>
            Let's get your account set up by adding your personal information
          </Text>
        </View>



        {/* Username Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>USERNAME</Text>
          <View style={styles.inputWithIcon}>
            <AtIcon width={20} height={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="tuvaljane"
              placeholderTextColor={Colors.placeholder}
              value={data.username}
              onChangeText={handleUsernameChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.username ? (
            <Text style={styles.errorText}>{errors.username}</Text>
          ) : (
            <Text style={styles.helperText}>
              small caps, and numbers are allowed (you can't change the
              username)
            </Text>
          )}
        </View>

        {/* Country Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>COUNTRY</Text>
          <TouchableOpacity
            style={styles.inputWithIcon}
            onPress={() => setShowCountryDropdown(true)}
          >
            <GlobeIcon width={20} height={20} style={styles.inputIcon} />
            <View style={styles.countryInput}>
              <Text style={[styles.input, !data.country && styles.placeholder]}>
                {data.country || "USA"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            disabled={
              !data.username || !data.country || !!errors.username
            }
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Country Dropdown Modal */}
      <CountrySelectModal
        visible={showCountryDropdown}
        onClose={() => setShowCountryDropdown(false)}
        onSelect={handleSelectCountry}
        selectedCountry={data.country}
      />
    </KeyboardAvoidingView>
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
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  placeholder: {
    color: Colors.placeholder,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
  },
  countryInput: {
    flex: 1,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  helperText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontStyle: "italic",
  },
  errorText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
});
