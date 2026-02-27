import * as VideoThumbnails from "expo-video-thumbnails";
import { useEffect, useState } from "react";
import { Image, ImageStyle, StyleProp, StyleSheet, View } from "react-native";

interface VideoThumbnailProps {
  videoUri: string;
  style?: StyleProp<ImageStyle>;
}

const VideoThumbnail = ({ videoUri, style }: VideoThumbnailProps) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
          time: 0,
        });
        setThumbnail(uri);
      } catch (e) {
        console.warn("Failed to generate video thumbnail:", e);
      }
    };

    generateThumbnail();
  }, [videoUri]);

  if (!thumbnail) {
    return <View style={[style, styles.placeholder]} />;
  }

  return <Image source={{ uri: thumbnail }} style={style} resizeMode="cover" />;
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#E5E7EB",
  },
});

export default VideoThumbnail;
