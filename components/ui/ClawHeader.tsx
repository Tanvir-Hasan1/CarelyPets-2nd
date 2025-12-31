import ClawIcon from "@/assets/images/icons/Claw-icon.svg";
import { FontSizes, Spacing } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ClawHeaderProps {
  size?: number;
  title?: string;
}

const ClawHeader: React.FC<ClawHeaderProps> = ({
  size = 55,
  title = "Carely Pets",
}) => {
  return (
    <View style={styles.container}>
      <ClawIcon width={size} height={size} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: Spacing.md,
  },
  title: {
    color: "#006D77", // Specific teal color from design
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
});

export default ClawHeader;
