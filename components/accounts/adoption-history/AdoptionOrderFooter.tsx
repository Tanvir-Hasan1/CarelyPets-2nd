import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface AdoptionOrderFooterProps {
  statusLabel: string;
  footerIcon: ReactNode;
}

export default function AdoptionOrderFooter({
  statusLabel,
  footerIcon,
}: AdoptionOrderFooterProps) {
  return (
    <View style={styles.footerCard}>
      <Text style={styles.footerText}>{statusLabel}</Text>
      {footerIcon}
    </View>
  );
}

const styles = StyleSheet.create({
  footerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  footerText: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "600",
  },
});
