import Header from "@/components/ui/Header";
import { Colors } from "@/constants/colors";
import legalService from "@/services/legalService";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";

export default function PrivacyAndPolicy() {
  const { width } = useWindowDimensions();
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const data = await legalService.getPrivacyPolicy();
      if (data) {
        setContent(data.content);
      }
    } catch (error) {
      console.error("Error loading privacy policy:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tagsStyles = {
    p: {
      fontSize: 14,
      color: Colors.text,
      marginBottom: 10,
      lineHeight: 22,
    },
    h1: {
      fontSize: 24,
      color: "#006064",
      marginBottom: 16,
      marginTop: 8,
    },
    h2: {
      fontSize: 18,
      color: "#111827",
      marginBottom: 12,
      marginTop: 16,
      fontWeight: "bold",
    },
    b: {
      fontWeight: "bold",
      color: "#111827",
    },
  };

  return (
    <View style={styles.container}>
      <Header title="Privacy Policy" />
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <RenderHtml
            contentWidth={width - 40}
            source={{ html: content || "<p>No content available.</p>" }}
            // @ts-ignore
            tagsStyles={tagsStyles}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
