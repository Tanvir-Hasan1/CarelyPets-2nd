import ClawIcon from "@/assets/images/icons/Claw-icon.svg";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
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
    color: Colors.primary,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold as any,
  },
});

export default ClawHeader;
