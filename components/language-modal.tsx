import { Ionicons } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { languageAtom, setLanguageAtom } from "@/atoms/language-atom";
import { useI18n } from "@/hooks/use-i18n";
import { useTheme } from "@/hooks/use-theme";

export function LanguageModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { languages, changeLanguage, t } = useI18n();
  const { colorScheme } = useTheme();
  const [currentLanguage] = useAtom(languageAtom);
  const setLanguage = useSetAtom(setLanguageAtom);

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

  const handleLanguageSelect = async (langCode: string) => {
    await changeLanguage(langCode);
    await setLanguage(langCode);
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

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modalContent,
            colorScheme === "dark" && styles.darkModalContent,
            {
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
        >
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                colorScheme === "dark" && styles.darkModalTitle,
              ]}
            >
              {t("profile.selectLanguage")}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={28}
                color={colorScheme === "dark" ? "#e0e0e0" : "#2c3e50"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.languageList}
            showsVerticalScrollIndicator={false}
          >
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  currentLanguage === language.code &&
                    styles.selectedLanguageItem,
                  colorScheme === "dark" && styles.darkLanguageItem,
                  currentLanguage === language.code &&
                    colorScheme === "dark" &&
                    styles.darkSelectedLanguageItem,
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <Text style={styles.flag}>{language.flag}</Text>
                <Text
                  style={[
                    styles.languageName,
                    colorScheme === "dark" && styles.darkLanguageName,
                  ]}
                >
                  {language.name}
                </Text>
                {currentLanguage === language.code && (
                  <Ionicons
                    name="checkmark"
                    size={24}
                    color="#3498db"
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    maxHeight: "70%",
  },
  darkModalContent: {
    backgroundColor: "#1e1e1e",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  darkModalTitle: {
    color: "#e0e0e0",
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
  },
  darkLanguageItem: {
    backgroundColor: "#2c2c2c",
  },
  selectedLanguageItem: {
    backgroundColor: "#e3f2fd",
    borderWidth: 2,
    borderColor: "#3498db",
  },
  darkSelectedLanguageItem: {
    backgroundColor: "#1a237e",
    borderColor: "#3498db",
  },
  flag: {
    fontSize: 28,
    marginRight: 16,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  darkLanguageName: {
    color: "#e0e0e0",
  },
  checkIcon: {
    marginLeft: 8,
  },
});
