import { useVideoPlayer, VideoView } from "expo-video";
import { Maximize, Play } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import VideoViewingModal from "../ui/VideoViewingModal";

interface PetHubVideoPlayerProps {
  uri: string;
  style?: any;
}

const { width: windowWidth } = Dimensions.get("window");

const PetHubVideoPlayer = ({ uri, style }: PetHubVideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    const subscription = player.addListener("playingChange", (payload) => {
      setIsPlaying(payload.isPlaying);
    });
    return () => {
      subscription.remove();
    };
  }, [player]);

  const togglePlay = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleFullscreen = () => {
    // Note: expo-video's enterFullscreen might not be directly on player in all versions,
    // but usually VideoView handles the UI. We can also handle it via state if needed.
    // However, the requirement is to show jump buttons only in full screen.
    setIsFullscreen(true);
  };

  // Listen for fullscreen change if possible, or just rely on state for our custom overlay
  // For simplicity, we show our custom overlay when NOT in native full screen.

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={togglePlay}
        style={styles.videoWrapper}
      >
        <VideoView
          player={player}
          style={styles.video}
          nativeControls={false} // Always false here, we use custom overlay or modal
          contentFit="cover"
        />
      </TouchableOpacity>

      {/* Overlay - Only show if NOT isPlaying or if we want tap-to-show logic */}
      {/* User requested: after clicking on play button, the button will be invisible */}
      {!isPlaying && (
        <View style={styles.overlay} pointerEvents="box-none">
          {/* Center Play/Pause Button */}
          <TouchableOpacity style={styles.centerButton} onPress={togglePlay}>
            <Play size={40} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Left Full Screen Icon - Always visible or follows overlay? */}
      {/* Usually full screen icon stays visible or fades. I'll keep it visible for now as requested. */}
      {!isFullscreen && (
        <View style={styles.bottomControls} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleFullscreen}
          >
            <Maximize size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      <VideoViewingModal
        visible={isFullscreen}
        videoUri={uri}
        onClose={() => setIsFullscreen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: 400,
    backgroundColor: "#000000",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  videoWrapper: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 8,
  },
});

export default PetHubVideoPlayer;
