import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface VideoViewingModalProps {
  visible: boolean;
  videoUri: string | null;
  onClose: () => void;
}

const VideoViewingModal = ({
  visible,
  videoUri,
  onClose,
}: VideoViewingModalProps) => {
  const insets = useSafeAreaInsets();
  const player = useVideoPlayer(
    videoUri ? { uri: videoUri, useCaching: true } : "",
    (player) => {
      player.loop = false;
      if (visible && videoUri) {
        player.play();
      }
    },
  );

  useEffect(() => {
    if (!visible) {
      player.pause();
    } else if (videoUri) {
      player.play();
    }
  }, [visible, videoUri, player]);

  if (!videoUri) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.closeButton, { top: insets.top + 16 }]}
          onPress={onClose}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={32} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            nativeControls
            allowsPictureInPicture
            fullscreenOptions={{ enable: true }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default VideoViewingModal;
