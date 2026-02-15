import { useI18n } from "@/hooks/use-i18n";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MicrophoneDevice {
  id: string;
  name: string;
  type?: string;
}

interface MicrophoneModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (microphoneId: string) => void;
  selectedId: string | null;
  microphones: MicrophoneDevice[];
}

export function MicrophoneModal({
  visible,
  onClose,
  onSelect,
  selectedId,
  microphones,
}: MicrophoneModalProps) {
  const { t } = useI18n();
  const { colorScheme } = useTheme();

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleMicrophoneSelect = (micId: string) => {
    // Animate out first, then close
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSelect(micId);
      onClose();
    });
  };

  const handleClose = () => {
    // Animate out first, then close
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const isDark = colorScheme === "dark";

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Animated.View
          style={[
            styles.modalContent,
            isDark && styles.darkModalContent,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 500],
                  }),
                },
              ],
            },
          ]}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.modalHeader, isDark && styles.darkModalHeader]}>
            <View style={styles.headerTextContainer}>
              <Text
                style={[styles.modalTitle, isDark && styles.darkModalTitle]}
              >
                {t("microphoneModal.title")}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#8e8e93" : "#8e8e93"}
              />
            </TouchableOpacity>
          </View>

          {/* Microphone List */}
          <ScrollView
            style={styles.microphoneList}
            showsVerticalScrollIndicator={true}
          >
            {microphones.map((mic) => (
              <TouchableOpacity
                key={mic.id}
                style={[
                  styles.microphoneItem,
                  isDark && styles.darkMicrophoneItem,
                  selectedId === mic.id && styles.selectedMicrophoneItem,
                  selectedId === mic.id &&
                    isDark &&
                    styles.darkSelectedMicrophoneItem,
                ]}
                onPress={() => handleMicrophoneSelect(mic.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.micIconContainer,
                    selectedId === mic.id && styles.selectedMicIconContainer,
                    selectedId === mic.id &&
                      isDark &&
                      styles.darkSelectedMicIconContainer,
                  ]}
                >
                  <Ionicons
                    name="mic"
                    size={20}
                    color={
                      selectedId === mic.id
                        ? "#ffffff"
                        : isDark
                          ? "#0a7ea4"
                          : "#0a7ea4"
                    }
                  />
                </View>
                <View style={styles.micInfoContainer}>
                  <Text
                    style={[
                      styles.microphoneName,
                      isDark && styles.darkMicrophoneName,
                      selectedId === mic.id && styles.selectedMicrophoneName,
                    ]}
                    numberOfLines={1}
                  >
                    {mic.name}
                  </Text>
                  {mic.type && (
                    <Text
                      style={[
                        styles.microphoneType,
                        isDark && styles.darkMicrophoneType,
                      ]}
                      numberOfLines={1}
                    >
                      {mic.type}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={
                    selectedId === mic.id
                      ? "#0a7ea4"
                      : isDark
                        ? "#2a2a2a"
                        : "#e5e5e5"
                  }
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Empty State */}
          {microphones.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons
                name="mic-off-outline"
                size={48}
                color={isDark ? "#3a3a3a" : "#d0d0d0"}
              />
              <Text
                style={[
                  styles.emptyStateText,
                  isDark && styles.darkEmptyStateText,
                ]}
              >
                No microphones found
              </Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 16,
    maxHeight: "70%",
  },
  darkModalContent: {
    backgroundColor: "#1c1c1e",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  darkModalHeader: {
    borderBottomColor: "#2c2c2e",
  },
  headerTextContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
    letterSpacing: -0.3,
  },
  darkModalTitle: {
    color: "#ffffff",
  },
  closeButton: {
    padding: 8,
  },
  microphoneList: {
    paddingHorizontal: 0,
  },
  microphoneItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "transparent",
  },
  darkMicrophoneItem: {
    borderBottomColor: "#2c2c2e",
  },
  selectedMicrophoneItem: {
    backgroundColor: "transparent",
  },
  darkSelectedMicrophoneItem: {
    backgroundColor: "transparent",
  },
  micIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedMicIconContainer: {
    backgroundColor: "#0a7ea4",
  },
  darkSelectedMicIconContainer: {
    backgroundColor: "#0a7ea4",
  },
  micInfoContainer: {
    flex: 1,
  },
  microphoneName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1c1c1e",
    lineHeight: 20,
  },
  darkMicrophoneName: {
    color: "#ffffff",
  },
  selectedMicrophoneName: {
    fontWeight: "600",
  },
  microphoneType: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8e8e93",
    marginTop: 2,
  },
  darkMicrophoneType: {
    color: "#98989d",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#8e8e93",
    marginTop: 12,
  },
  darkEmptyStateText: {
    color: "#8e8e93",
  },
});
