import {
  BandDescriptionModal,
  BandLevel,
} from "@/components/band-description-modal";
import {
  PracticeSettings,
  PracticeSettingsModal,
} from "@/components/practice-settings-modal";
import { useI18n } from "@/hooks/use-i18n";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

type ExamCategory = "CEFR" | "IELTS";

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const { t } = useI18n();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [bandModalVisible, setBandModalVisible] = useState(false);
  const [selectedBandPart, setSelectedBandPart] = useState<BandLevel | null>(null);
  const [activeCategory, setActiveCategory] = useState<ExamCategory>("CEFR");
  const pagerRef = useRef<PagerView>(null);

  // Animated indicator
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(50)).current; // For width (non-native)
  const [cefrTabWidth, setCefrTabWidth] = useState(0);
  const [ieltsTabWidth, setIeltsTabWidth] = useState(0);
  const tabGap = 32; // Must match styles.tabGap

  const handleCefrTabLayout = (e: any) => {
    setCefrTabWidth(e.nativeEvent.layout.width);
  };

  const handleIeltsTabLayout = (e: any) => {
    setIeltsTabWidth(e.nativeEvent.layout.width);
  };

  // Get indicator style - centered based on tab widths
  const getIndicatorStyle = () => {
    const screenWidth = Dimensions.get("window").width;
    const totalWidth = (cefrTabWidth || 50) + (ieltsTabWidth || 55) + tabGap;
    const startX = (screenWidth - 40 - totalWidth) / 2; // -40 for paddingHorizontal
    const cefrWidth = cefrTabWidth || 50;

    return {
      left: 20 + startX, // +20 for container's paddingHorizontal
      transform: [
        {
          translateX: indicatorAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, cefrWidth + tabGap],
          }),
        },
      ],
    };
  };

  // Update indicator position when category changes
  useEffect(() => {
    const targetIndex = activeCategory === "CEFR" ? 0 : 1;
    const targetWidth =
      activeCategory === "CEFR" ? cefrTabWidth || 50 : ieltsTabWidth || 55;

    // Animate position (native driver)
    Animated.spring(indicatorAnim, {
      toValue: targetIndex,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();

    // Animate width (non-native driver)
    Animated.spring(widthAnim, {
      toValue: targetWidth,
      useNativeDriver: false,
      tension: 300,
      friction: 20,
    }).start();
  }, [activeCategory, cefrTabWidth, ieltsTabWidth]);

  const handleCardPress = (part: string) => {
    setSelectedPart(part);
    setModalVisible(true);
  };

  const handleStartPractice = (settings: PracticeSettings) => {
    console.log("Starting practice with settings:", settings);
    // TODO: Navigate to practice screen with settings
    // Navigate to the actual practice session with selected voice and microphone
  };

  const handleTabPress = (category: ExamCategory) => {
    setActiveCategory(category);
    pagerRef.current?.setPage(category === "CEFR" ? 0 : 1);
  };

  const handlePageSelected = (e: any) => {
    const page = e.nativeEvent.position;
    setActiveCategory(page === 0 ? "CEFR" : "IELTS");
  };

  const handlePageScroll = (e: any) => {
    const offset = e.nativeEvent.offset;
    const position = e.nativeEvent.position;
    // Update indicator position smoothly during swipe
    indicatorAnim.setValue(position + offset);
  };

  const handleBandDescriptionPress = (part: BandLevel) => {
    setSelectedBandPart(part);
    setBandModalVisible(true);
  };

  const renderCEFRContent = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.pageContent}
    >
      <View style={styles.contentCards}>
        {/* CEFR Speaking Test Part 1 */}
        <TouchableOpacity
          style={[
            styles.examCard,
            colorScheme === "dark" && styles.darkExamCard,
          ]}
          onPress={() => handleCardPress("Part 1")}
          activeOpacity={0.7}
        >
          <View style={styles.examHeader}>
            <View style={styles.examBadgePart1}>
              <Ionicons name="chatbubbles" size={20} color="#ffffff" />
              <Text style={styles.examBadgeText}>{t("home.part")} 1</Text>
            </View>
            <View style={styles.examLevels}>
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot1,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot2,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot3,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot4,
                ]}
              />
            </View>
          </View>
          <Text
            style={[
              styles.examTitle,
              colorScheme === "dark" && styles.darkExamTitle,
            ]}
          >
            {t("home.speakingPart1")}
          </Text>
          <Text
            style={[
              styles.examDescription,
              colorScheme === "dark" && styles.darkExamDescription,
            ]}
          >
            {t("home.speakingPart1Description")}
          </Text>
          <View style={styles.examFooter}>
            <View style={styles.examDuration}>
              <Ionicons name="time-outline" size={16} color="#3498db" />
              <Text style={[styles.examDurationText, { color: "#3498db" }]}>
                4-5 min
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.examButton, { backgroundColor: "#3498db" }]}
            >
              <Text style={styles.examButtonText}>{t("home.startPart1")}</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* CEFR Speaking Test Part 2 */}
        <TouchableOpacity
          style={[
            styles.examCard,
            colorScheme === "dark" && styles.darkExamCard,
          ]}
          onPress={() => handleCardPress("Part 2")}
          activeOpacity={0.7}
        >
          <View style={styles.examHeader}>
            <View style={styles.examBadgePart2}>
              <Ionicons name="card" size={20} color="#ffffff" />
              <Text style={styles.examBadgeText}>{t("home.part")} 2</Text>
            </View>
            <View style={styles.examLevels}>
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot3,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot4,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot5,
                ]}
              />
            </View>
          </View>
          <Text
            style={[
              styles.examTitle,
              colorScheme === "dark" && styles.darkExamTitle,
            ]}
          >
            {t("home.speakingPart2")}
          </Text>
          <Text
            style={[
              styles.examDescription,
              colorScheme === "dark" && styles.darkExamDescription,
            ]}
          >
            {t("home.speakingPart2Description")}
          </Text>
          <View style={styles.examFooter}>
            <View style={styles.examDuration}>
              <Ionicons name="time-outline" size={16} color="#9b59b6" />
              <Text style={[styles.examDurationText, { color: "#9b59b6" }]}>
                3-4 min
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.examButton, { backgroundColor: "#9b59b6" }]}
            >
              <Text style={styles.examButtonText}>{t("home.startPart2")}</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* CEFR Speaking Test Part 3 */}
        <TouchableOpacity
          style={[
            styles.examCard,
            colorScheme === "dark" && styles.darkExamCard,
          ]}
          onPress={() => handleCardPress("Part 3")}
          activeOpacity={0.7}
        >
          <View style={styles.examHeader}>
            <View style={styles.examBadgePart3}>
              <Ionicons name="people" size={20} color="#ffffff" />
              <Text style={styles.examBadgeText}>{t("home.part")} 3</Text>
            </View>
            <View style={styles.examLevels}>
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot4,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot5,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot6,
                ]}
              />
            </View>
          </View>
          <Text
            style={[
              styles.examTitle,
              colorScheme === "dark" && styles.darkExamTitle,
            ]}
          >
            {t("home.speakingPart3")}
          </Text>
          <Text
            style={[
              styles.examDescription,
              colorScheme === "dark" && styles.darkExamDescription,
            ]}
          >
            {t("home.speakingPart3Description")}
          </Text>
          <View style={styles.examFooter}>
            <View style={styles.examDuration}>
              <Ionicons name="time-outline" size={16} color="#e74c3c" />
              <Text style={[styles.examDurationText, { color: "#e74c3c" }]}>
                5-6 min
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.examButton, { backgroundColor: "#e74c3c" }]}
            >
              <Text style={styles.examButtonText}>{t("home.startPart3")}</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* CEFR Full Test */}
        <TouchableOpacity
          style={[
            styles.examCard,
            colorScheme === "dark" && styles.darkExamCard,
          ]}
          onPress={() => handleCardPress("Full Test")}
          activeOpacity={0.7}
        >
          <View style={styles.examHeader}>
            <View style={styles.examBadge}>
              <Ionicons name="mic" size={20} color="#ffffff" />
              <Text style={styles.examBadgeText}>Full Test</Text>
            </View>
            <View style={styles.examLevels}>
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot1,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot2,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot3,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot4,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot5,
                ]}
              />
              <View
                style={[
                  styles.examLevelDot,
                  colorScheme === "dark" && styles.darkExamLevelDot,
                  styles.examLevelDot6,
                ]}
              />
            </View>
          </View>
          <Text
            style={[
              styles.examTitle,
              colorScheme === "dark" && styles.darkExamTitle,
            ]}
          >
            {t("home.fullTest")}
          </Text>
          <Text
            style={[
              styles.examDescription,
              colorScheme === "dark" && styles.darkExamDescription,
            ]}
          >
            {t("home.fullTestDescription")}
          </Text>
          <View style={styles.examFooter}>
            <View style={styles.examDuration}>
              <Ionicons name="time-outline" size={16} color="#e67322" />
              <Text style={[styles.examDurationText]}>15-30 min</Text>
            </View>
            <TouchableOpacity style={styles.examButton}>
              <Text style={styles.examButtonText}>{t("home.startTest")}</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderIELTSContent = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.pageContent}
    >
      <View style={styles.contentCards}>
        {/* IELTS Speaking Part 1 */}
        <View
          style={[
            styles.examCard,
            colorScheme === "dark" && styles.darkExamCard,
          ]}
        >
          <View style={styles.examHeader}>
            <View style={styles.examBadgeIelts}>
              <Ionicons name="chatbubbles" size={20} color="#ffffff" />
              <Text style={styles.examBadgeText}>Part 1</Text>
            </View>
            <View style={styles.examLevels}>
              <TouchableOpacity
                onPress={() => handleBandDescriptionPress("Part 1")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.examLevel,
                    colorScheme === "dark" && styles.darkExamLevel,
                    styles.examLevelClickable,
                  ]}
                >
                  Band description
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[
              styles.examTitle,
              colorScheme === "dark" && styles.darkExamTitle,
            ]}
          >
            IELTS Speaking Part 1
          </Text>
          <Text
            style={[
              styles.examDescription,
              colorScheme === "dark" && styles.darkExamDescription,
            ]}
          >
            Introduction and interview on familiar topics like work, home,
            hobbies
          </Text>
          <View style={styles.examFooter}>
            <View style={styles.examDuration}>
              <Ionicons name="time-outline" size={16} color="#dc2626" />
              <Text style={[styles.examDurationText, { color: "#dc2626" }]}>
                4-5 min
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCardPress("IELTS Part 1")}
              activeOpacity={0.7}
              style={[styles.examButton, { backgroundColor: "#dc2626" }]}
            >
              <Text style={styles.examButtonText}>Start Part 1</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* IELTS Speaking Part 2 */}
        <View
          style={[
            styles.examCard,
            colorScheme === "dark" && styles.darkExamCard,
          ]}
        >
          <View style={styles.examHeader}>
            <View style={styles.examBadgeIelts2}>
              <Ionicons name="card" size={20} color="#ffffff" />
              <Text style={styles.examBadgeText}>Part 2</Text>
            </View>
            <View style={styles.examLevels}>
              <TouchableOpacity
                onPress={() => handleBandDescriptionPress("Part 2")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.examLevel,
                    colorScheme === "dark" && styles.darkExamLevel,
                    styles.examLevelClickable,
                  ]}
                >
                  Band description
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[
              styles.examTitle,
              colorScheme === "dark" && styles.darkExamTitle,
            ]}
          >
            IELTS Speaking Part 2
          </Text>
          <Text
            style={[
              styles.examDescription,
              colorScheme === "dark" && styles.darkExamDescription,
            ]}
          >
            Individual long turn with 1 minute preparation time
          </Text>
          <View style={styles.examFooter}>
            <View style={styles.examDuration}>
              <Ionicons name="time-outline" size={16} color="#b91c1c" />
              <Text style={[styles.examDurationText, { color: "#b91c1c" }]}>
                3-4 min
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCardPress("IELTS Part 2")}
              activeOpacity={0.7}
              style={[styles.examButton, { backgroundColor: "#b91c1c" }]}
            >
              <Text style={styles.examButtonText}>Start Part 2</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* IELTS Speaking Part 3 */}
        <View
          style={[
            styles.examCard,
            colorScheme === "dark" && styles.darkExamCard,
          ]}
        >
          <View style={styles.examHeader}>
            <View style={styles.examBadgeIelts3}>
              <Ionicons name="people" size={20} color="#ffffff" />
              <Text style={styles.examBadgeText}>Part 3</Text>
            </View>
            <View style={styles.examLevels}>
              <TouchableOpacity
                onPress={() => handleBandDescriptionPress("Part 3")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.examLevel,
                    colorScheme === "dark" && styles.darkExamLevel,
                    styles.examLevelClickable,
                  ]}
                >
                  Band description
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[
              styles.examTitle,
              colorScheme === "dark" && styles.darkExamTitle,
            ]}
          >
            IELTS Speaking Part 3
          </Text>
          <Text
            style={[
              styles.examDescription,
              colorScheme === "dark" && styles.darkExamDescription,
            ]}
          >
            Two-way discussion on abstract topics and issues
          </Text>
          <View style={styles.examFooter}>
            <View style={styles.examDuration}>
              <Ionicons name="time-outline" size={16} color="#991b1b" />
              <Text style={[styles.examDurationText, { color: "#991b1b" }]}>
                4-5 min
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCardPress("IELTS Part 3")}
              activeOpacity={0.7}
              style={[styles.examButton, { backgroundColor: "#991b1b" }]}
            >
              <Text style={styles.examButtonText}>Start Part 3</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* IELTS Full Test */}
        <View
          style={[
            styles.examCard,
            colorScheme === "dark" && styles.darkExamCard,
          ]}
        >
          <View style={styles.examHeader}>
            <View style={styles.examBadge}>
              <Ionicons name="mic" size={20} color="#ffffff" />
              <Text style={styles.examBadgeText}>Full Test</Text>
            </View>
            <View style={styles.examLevels}>
              <TouchableOpacity
                onPress={() => handleBandDescriptionPress("Full Test")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.examLevel,
                    colorScheme === "dark" && styles.darkExamLevel,
                    styles.examLevelClickable,
                  ]}
                >
                  Band description
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[
              styles.examTitle,
              colorScheme === "dark" && styles.darkExamTitle,
            ]}
          >
            IELTS Full Speaking Test
          </Text>
          <Text
            style={[
              styles.examDescription,
              colorScheme === "dark" && styles.darkExamDescription,
            ]}
          >
            Complete IELTS Speaking exam with all three parts
          </Text>
          <View style={styles.examFooter}>
            <View style={styles.examDuration}>
              <Ionicons name="time-outline" size={16} color="#7f1d1d" />
              <Text style={[styles.examDurationText, { color: "#7f1d1d" }]}>
                11-14 min
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCardPress("IELTS Full Test")}
              activeOpacity={0.7}
              style={[styles.examButton, { backgroundColor: "#7f1d1d" }]}
            >
              <Text style={styles.examButtonText}>Start Test</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={[styles.container, colorScheme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabPress("CEFR")}
          activeOpacity={0.7}
          onLayout={handleCefrTabLayout}
        >
          <Text
            style={[
              activeCategory === "CEFR" ? styles.activeTab : styles.inactiveTab,
            ]}
          >
            CEFR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => handleTabPress("IELTS")}
          activeOpacity={0.7}
          onLayout={handleIeltsTabLayout}
        >
          <Text
            style={[
              activeCategory === "IELTS"
                ? styles.activeTab
                : styles.inactiveTab,
            ]}
          >
            IELTS
          </Text>
        </TouchableOpacity>
        {/* Animated Indicator */}
        <Animated.View style={[styles.tabIndicator, getIndicatorStyle()]}>
          <Animated.View
            style={{
              width: widthAnim,
              height: "100%",
              backgroundColor: "#3498db",
            }}
          />
        </Animated.View>
      </View>

      {/* PagerView for swipeable content */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
        onPageScroll={handlePageScroll}
      >
        <View key="1">{renderCEFRContent()}</View>
        <View key="2">{renderIELTSContent()}</View>
      </PagerView>

      {/* Practice Settings Modal */}
      <PracticeSettingsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStart={handleStartPractice}
      />

      {/* Band Description Modal */}
      <BandDescriptionModal
        visible={bandModalVisible}
        onClose={() => setBandModalVisible(false)}
        part={selectedBandPart}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  darkContainer: {
    backgroundColor: "#1a1a1a",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    justifyContent: "center",
    gap: 32,
    position: "relative",
  },
  tab: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    position: "relative",
  },
  activeTab: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3498db",
  },
  inactiveTab: {
    fontSize: 16,
    fontWeight: "500",
    color: "#7f8c8d",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 8,
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  pagerView: {
    flex: 1,
  },
  pageContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  contentCards: {
    paddingHorizontal: 20,
    gap: 16,
  },
  examCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkExamCard: {
    backgroundColor: "#2c2c2c",
  },
  examHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  examBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e67322",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  examBadgePart1: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  examBadgePart2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9b59b6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  examBadgePart3: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  examBadgeIelts: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  examBadgeIelts2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b91c1c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  examBadgeIelts3: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#991b1b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  examBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  examLevels: {
    flexDirection: "row",
    gap: 6,
  },
  examLevel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#e67322",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  darkExamLevel: {
    backgroundColor: "#4e3726",
  },
  examLevelClickable: {
    textDecorationLine: "underline",
  },
  examLevelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22e63c",
  },
  darkExamLevelDot: {
    backgroundColor: "#17f50b",
  },
  examLevelDot1: {
    opacity: 0.4,
  },
  examLevelDot2: {
    opacity: 0.6,
  },
  examLevelDot3: {
    opacity: 0.8,
  },
  examLevelDot4: {
    opacity: 1,
  },
  examLevelDot5: {
    opacity: 1,
  },
  examLevelDot6: {
    opacity: 1,
  },
  examTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 8,
  },
  darkExamTitle: {
    color: "#e0e0e0",
  },
  examDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
    marginBottom: 16,
  },
  darkExamDescription: {
    color: "#b0b0b0",
  },
  examFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  examDuration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  examDurationText: {
    fontSize: 14,
    color: "#e67322",
    fontWeight: "600",
  },
  examButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e67322",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  examButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
