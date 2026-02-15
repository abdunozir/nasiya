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

export type BandLevel = "Part 1" | "Part 2" | "Part 3" | "Full Test";

interface Props {
  visible: boolean;
  onClose: () => void;
  part: BandLevel | null;
}

export function BandDescriptionModal({ visible, onClose, part }: Props) {
  const { colorScheme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

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
            colorScheme === "dark" && styles.darkModalContent,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 700],
                  }),
                },
              ],
            },
          ]}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                colorScheme === "dark" && styles.darkModalTitle,
              ]}
            >
              IELTS Bands
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={24}
                color={colorScheme === "dark" ? "#e0e0e0" : "#2c3e50"}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginBottom: 16 }}>
              <Text
                style={[
                  styles.bandDescription,
                  colorScheme === "dark" && styles.darkBandDescription,
                ]}
              >
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  Band 9
                </Text>{" "}
                -- Has complete command in the English language;{" "}
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  accurate, highly flexible
                </Text>
                , appropriate,{" "}
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  fluent
                </Text>{" "}
                with full understanding.
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={[
                  styles.bandDescription,
                  colorScheme === "dark" && styles.darkBandDescription,
                ]}
              >
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  Band 8
                </Text>{" "}
                -- Has complete command with only rare errors (which are
                unsystematic) or inappropriate words.{" "}
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  Deals with complex situations well
                </Text>
                , but with{" "}
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  rare errors
                </Text>
                , and can deal with detailed argument.
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={[
                  styles.bandDescription,
                  colorScheme === "dark" && styles.darkBandDescription,
                ]}
              >
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  Band 7
                </Text>{" "}
                -- Has good command of English but also has{" "}
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  occasional inaccuracies
                </Text>
                , misunderstandings or inappropriate words. Can use{" "}
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  complex language
                </Text>{" "}
                quite well and understands detailed argument quite well.
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={[
                  styles.bandDescription,
                  colorScheme === "dark" && styles.darkBandDescription,
                ]}
              >
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  Band 6
                </Text>{" "}
                -- Has effective command of English but also{" "}
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  some errors
                </Text>
                , inappropriate words and misunderstandings. Can use complex
                language quite well, but best in{" "}
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  familiar situations
                </Text>{" "}
                .
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={[
                  styles.bandDescription,
                  colorScheme === "dark" && styles.darkBandDescription,
                ]}
              >
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  Band 5
                </Text>{" "}
                -- Has partial command of English and can deal with overall
                meaning. Makes{" "}
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  frequent errors.
                </Text>{" "}
                Has better English in{" "}
                <Text style={{ fontWeight: "700", color: "#dc2626" }}>
                  common situations.
                </Text>{" "}
                Does not deal with complex language well.
              </Text>
            </View>
            {/* https://ucarecdn.com/226a4405-9b58-4f06-87c4-ac7a99465749/-/scale_crop/300x300/ */}
            {/* <Image
              resizeMode="cover"
              source={{
                uri: "https://ucarecdn.com/226a4405-9b58-4f06-87c4-ac7a99465749/-/scale_crop/300x300/",
              }}
              style={{ width: "100%", height: 300 }}
            /> */}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.modalCloseButton, { backgroundColor: "#dc2626" }]}
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    minHeight: 600,
    paddingBottom: 20,
  },
  darkModalContent: {
    backgroundColor: "#2c2c2c",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
  },
  darkModalTitle: {
    color: "#e0e0e0",
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  bandDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4a5568",
  },
  darkBandDescription: {
    color: "#b0b0b0",
  },
  modalCloseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  modalCloseButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
