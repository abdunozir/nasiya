import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

const MICROPHONE_STORAGE_KEY = "@ispeak_microphone";

export interface MicrophoneDevice {
  deviceId: string;
  label: string;
  kind?: string;
}

// Base atom for storing the selected microphone ID
const baseMicrophoneAtom = atom<string | null>(null);

// Read-only derived atom
export const microphoneAtom = atom<string | null>((get) =>
  get(baseMicrophoneAtom)
);

// Write-only derived atom for persistence
export const setMicrophoneAtom = atom(
  null,
  async (_get, set, newMicrophoneId: string | null) => {
    set(baseMicrophoneAtom, newMicrophoneId);
    if (newMicrophoneId) {
      await AsyncStorage.setItem(MICROPHONE_STORAGE_KEY, newMicrophoneId);
    } else {
      await AsyncStorage.removeItem(MICROPHONE_STORAGE_KEY);
    }
  }
);

// Helper function to initialize microphone from storage (call this in your app root)
export const initializeMicrophoneAtom = async (
  setAtom: (value: string | null) => void
) => {
  try {
    const savedMicrophone = await AsyncStorage.getItem(MICROPHONE_STORAGE_KEY);
    if (savedMicrophone) {
      setAtom(savedMicrophone);
    }
  } catch (error) {
    console.error("Failed to load microphone:", error);
  }
};
