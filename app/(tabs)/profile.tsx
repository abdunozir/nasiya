import { Ionicons } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import {
  initializeLanguageAtom,
  languageAtom,
  setLanguageAtom,
} from "@/atoms/language-atom";
import {
  initializeMicrophoneAtom,
  microphoneAtom,
  setMicrophoneAtom,
} from "@/atoms/microphone-atom";
import { LanguageModal } from "@/components/language-modal";
import { MicrophoneModal } from "@/components/microphone-modal";
import { useI18n } from "@/hooks/use-i18n";
import { useTheme } from "@/hooks/use-theme";
import { requestMicrophonePermissionAndEnumerate } from "@/lib/microphone-utils";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { colorScheme, toggleTheme } = useTheme();
  const { t, languages } = useI18n();
  const [language] = useAtom(languageAtom);
  const setLanguage = useSetAtom(setLanguageAtom);
  const [selectedMicrophone] = useAtom(microphoneAtom);
  const setMicrophone = useSetAtom(setMicrophoneAtom);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isMicrophoneModalVisible, setIsMicrophoneModalVisible] =
    useState(false);
  const [availableMicrophones, setAvailableMicrophones] = useState<
    { id: string; name: string; type?: string }[]
  >([]);
  const currentLanguage =
    languages.find((lang) => lang.code === language) || languages[0];

  // Initialize language from AsyncStorage on mount
  useEffect(() => {
    initializeLanguageAtom(setLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize microphone from AsyncStorage on mount
  useEffect(() => {
    initializeMicrophoneAtom(setMicrophone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load available microphones when microphone modal is opened
  const loadMicrophones = async () => {
    try {
      const result = await requestMicrophonePermissionAndEnumerate();
      const mics = result.microphones.map((mic) => ({
        id: mic.deviceId,
        name: mic.label,
        type: mic.kind,
      }));
      setAvailableMicrophones(mics);
    } catch (error) {
      console.error("Error loading microphones:", error);
      setAvailableMicrophones([]);
    }
  };

  const handleMicrophonePress = async () => {
    await loadMicrophones();
    setIsMicrophoneModalVisible(true);
  };

  const handleMicrophoneSelect = (microphoneId: string) => {
    setMicrophone(microphoneId);
  };

  const getSelectedMicrophoneName = () => {
    if (!selectedMicrophone) return t("practiceSettings.selectMicrophone");
    const mic = availableMicrophones.find((m) => m.id === selectedMicrophone);
    return mic?.name || t("practiceSettings.selectMicrophone");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={[
          styles.container,
          colorScheme === "dark" && styles.darkContainer,
        ]}
        edges={["top", "bottom"]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Card - Minimalist */}
          <View
            style={[
              styles.profileCard,
              colorScheme === "dark" && styles.darkProfileCard,
            ]}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#ffffff" />
            </View>
            <Text
              style={[
                styles.userName,
                colorScheme === "dark" && styles.darkUserName,
              ]}
            >
              John Doe
            </Text>
            <Text
              style={[
                styles.userEmail,
                colorScheme === "dark" && styles.darkUserEmail,
              ]}
            >
              john.doe@example.com
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statValue,
                    colorScheme === "dark" && styles.darkStatValue,
                  ]}
                >
                  45
                </Text>
                <Text style={styles.statLabel}>{t("profile.days")}</Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  colorScheme === "dark" && styles.darkStatDivider,
                ]}
              />
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statValue,
                    colorScheme === "dark" && styles.darkStatValue,
                  ]}
                >
                  1,234
                </Text>
                <Text style={styles.statLabel}>{t("profile.words")}</Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  colorScheme === "dark" && styles.darkStatDivider,
                ]}
              />
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statValue,
                    colorScheme === "dark" && styles.darkStatValue,
                  ]}
                >
                  890
                </Text>
                <Text style={styles.statLabel}>{t("profile.lessons")}</Text>
              </View>
            </View>
          </View>

          {/* Minimal Menu */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[
                styles.menuItem,
                styles.menuItemCompact,
                colorScheme === "dark" && styles.darkMenuItem,
              ]}
              onPress={toggleTheme}
            >
              <Ionicons
                name="moon-outline"
                size={20}
                color={colorScheme === "dark" ? "#e0e0e0" : "#2c3e50"}
              />
              <Text
                style={[
                  styles.menuText,
                  colorScheme === "dark" && styles.darkMenuText,
                ]}
              >
                {t("profile.darkMode")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuItem,
                styles.menuItemCompact,
                colorScheme === "dark" && styles.darkMenuItem,
              ]}
              onPress={() => setIsLanguageModalVisible(true)}
            >
              <Ionicons
                name="globe-outline"
                size={20}
                color={colorScheme === "dark" ? "#e0e0e0" : "#2c3e50"}
              />
              <View style={styles.languageContent}>
                <Text
                  style={[
                    styles.menuText,
                    colorScheme === "dark" && styles.darkMenuText,
                  ]}
                >
                  {t("profile.language")}
                </Text>
                <Text
                  style={[
                    styles.languageValue,
                    colorScheme === "dark" && styles.darkLanguageValue,
                  ]}
                >
                  {currentLanguage.name}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuItem,
                styles.menuItemCompact,
                colorScheme === "dark" && styles.darkMenuItem,
              ]}
              onPress={handleMicrophonePress}
            >
              <Ionicons
                name="mic-outline"
                size={20}
                color={colorScheme === "dark" ? "#e0e0e0" : "#2c3e50"}
              />
              <View style={styles.languageContent}>
                <Text
                  style={[
                    styles.menuText,
                    colorScheme === "dark" && styles.darkMenuText,
                  ]}
                >
                  {t("practiceSettings.selectMicrophone")}
                </Text>
                <Text
                  style={[
                    styles.languageValue,
                    colorScheme === "dark" && styles.darkLanguageValue,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {/* {getSelectedMicrophoneName()} */}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuItem,
                styles.menuItemCompact,
                colorScheme === "dark" && styles.darkMenuItem,
              ]}
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colorScheme === "dark" ? "#e0e0e0" : "#2c3e50"}
              />
              <Text
                style={[
                  styles.menuText,
                  colorScheme === "dark" && styles.darkMenuText,
                ]}
              >
                {t("profile.help")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuItem,
                styles.menuItemCompact,
                styles.logoutItem,
                colorScheme === "dark" && styles.darkLogoutItem,
              ]}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colorScheme === "dark" ? "#ff6b6b" : "#e74c3c"}
              />
              <Text style={[styles.menuText, styles.logoutText]}>
                {t("profile.logOut")}
              </Text>
            </TouchableOpacity>
          </View>

          <LanguageModal
            visible={isLanguageModalVisible}
            onClose={() => setIsLanguageModalVisible(false)}
          />
        </ScrollView>
      </SafeAreaView>
      <MicrophoneModal
        visible={isMicrophoneModalVisible}
        onClose={() => setIsMicrophoneModalVisible(false)}
        onSelect={handleMicrophoneSelect}
        selectedId={selectedMicrophone}
        microphones={availableMicrophones}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafbfc",
  },
  darkContainer: {
    backgroundColor: "#0f0f0f",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  darkProfileCard: {
    backgroundColor: "#1e1e1e",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  darkUserName: {
    color: "#e0e0e0",
  },
  userEmail: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 24,
  },
  darkUserEmail: {
    color: "#a0a0a0",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  darkStatValue: {
    color: "#e0e0e0",
  },
  statLabel: {
    fontSize: 11,
    color: "#95a5a6",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#ecf0f1",
  },
  darkStatDivider: {
    backgroundColor: "#2c2c2c",
  },
  section: {
    paddingHorizontal: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  darkMenuItem: {
    backgroundColor: "#1e1e1e",
  },
  menuItemCompact: {
    justifyContent: "flex-start",
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  darkMenuText: {
    color: "#e0e0e0",
  },
  logoutItem: {
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#fed7d7",
  },
  darkLogoutItem: {
    backgroundColor: "#2d1f1f",
    borderColor: "#4a2c2c",
  },
  logoutText: {
    color: "#e74c3c",
  },
  languageContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  languageValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#7f8c8d",
  },
  darkLanguageValue: {
    color: "#a0a0a0",
  },
});
