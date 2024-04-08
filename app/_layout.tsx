import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite/next";
import * as SecureStore from "expo-secure-store";
import { Provider } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import { AuthorizationStatus } from "@notifee/react-native";
import {
  DATABASE_NAME,
  SQUAWKER_PREFERENCES_BASE,
  createTable,
  isNotificationAllowed,
  requestNotificationPermission,
  sendRegistrationToServer,
  useNotificationObserver,
} from "../src/utils";
import { store } from "../src/configurestore";
import { useEffect } from "react";

export default function Layout() {
  useNotificationObserver();

  useEffect(() => {
    (async () => {
      try {
        const status = await requestNotificationPermission();
        if (status.authorizationStatus === AuthorizationStatus.DENIED) {
          alert(
            "You can fix this by visiting your settings and enabling notifications for this app"
          );
          return;
        }

        const isAllowed = await isNotificationAllowed();
        const prefKey = SQUAWKER_PREFERENCES_BASE + ".has_registered_token";
        // await SecureStore.deleteItemAsync(prefKey); //for debugging
        if (isAllowed && !SecureStore.getItem(prefKey)) {
          const token = await messaging().getToken();
          sendRegistrationToServer(token);
          SecureStore.setItemAsync(prefKey, "true");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  });
  return (
    <SafeAreaProvider>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        onInit={async (db) => {
          await createTable(db);
        }}
      >
        <Provider store={store}>
          <Slot />
        </Provider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
