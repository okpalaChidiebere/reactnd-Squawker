import { ExpoConfig, ConfigContext } from "expo/config";

const name = "Squawker";
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name,
  slug: "reactnd-Squawker",
  scheme: "reactndsquawker", // will be `reactndsquawker://`
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    "expo-router",
    "expo-secure-store",
    "@react-native-firebase/app",
  ],
  android: {
    googleServicesFile: "./google-services.json",
    package: "com.reactndsquawker",
    adaptiveIcon: {
      backgroundImage: "./assets/ic_launcher.png",
      foregroundImage: "./assets/ic_launcher.png",
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true || false,
        data: [{ scheme: "https", host: "reactndsquawker.com" }],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  ios: {
    bundleIdentifier: "com.reactndsquawker",
    icon: "./assets/ic_launcher-web.png",
    associatedDomains: ["applinks:reactndsquawker.com"],
    googleServicesFile: "./GoogleService-Info.plist",
    infoPlist: {
      NSUserNotificationsUsageDescription:
        "$(PRODUCT_NAME) app needs user notification to receive squawk messages", //custom notification dialog for iOS
      UIBackgroundModes: ["fetch", "remote-notification"],
    },
  },
  notification: {
    icon: "./assets/ic_duck.png",
  },
  extra: {
    eas: {
      projectId: "50131996-1ca7-4e47-aeda-45199824a6a1",
    },
  },
});

// build-1712213166537.apk  (preview build)
// build-1712215816684.apk  (dev build)
