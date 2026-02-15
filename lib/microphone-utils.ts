export interface MicrophoneDevice {
  deviceId: string;
  label: string;
  kind?: string;
}

/**
 * Enumerates available audio input devices (microphones) on the device.
 * Note: This is a web API and may not work in React Native without appropriate polyfills or Expo modules.
 *
 * For React Native/Expo, you would typically use:
 * - expo-av: for audio recording
 * - expo-media-library: for media access
 * - react-native-permissions: for permissions
 *
 * @returns Promise<MicrophoneDevice[]> Array of available microphones
 */
export async function getAvailableMicrophones(): Promise<MicrophoneDevice[]> {
  try {
    // Check if we're in a web environment
    if (
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.mediaDevices
    ) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const microphones = devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || "Microphone",
          kind: device.kind,
        }));

      return microphones;
    }

    // Fallback for React Native - return default device
    // In a real React Native app, you'd use expo-av or similar
    return [
      {
        deviceId: "default",
        label: "Default Microphone",
        kind: "audioinput",
      },
    ];
  } catch (error) {
    console.error("Error enumerating microphones:", error);
    return [
      {
        deviceId: "default",
        label: "Default Microphone",
        kind: "audioinput",
      },
    ];
  }
}

/**
 * Request microphone permissions and enumerate devices.
 * This is necessary because device labels are only available after permission is granted.
 *
 * @returns Promise<MicrophoneDevice[]> Array of available microphones with proper labels
 */
export async function requestMicrophonePermissionAndEnumerate(): Promise<{
  microphones: MicrophoneDevice[];
  permissionGranted: boolean;
}> {
  try {
    // Check if we're in a web environment
    if (
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.mediaDevices
    ) {
      // Request permission by getting user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Stop the stream immediately - we only needed it for permission
      stream.getTracks().forEach((track) => track.stop());

      // Now enumerate devices with labels
      const microphones = await getAvailableMicrophones();

      return {
        microphones,
        permissionGranted: true,
      };
    }

    // For React Native, you'd use expo-av or react-native-permissions
    return {
      microphones: [
        {
          deviceId: "default",
          label: "Default Microphone",
          kind: "audioinput",
        },
      ],
      permissionGranted: true,
    };
  } catch (error) {
    console.error("Error requesting microphone permission:", error);
    return {
      microphones: [
        {
          deviceId: "default",
          label: "Default Microphone",
          kind: "audioinput",
        },
      ],
      permissionGranted: false,
    };
  }
}
