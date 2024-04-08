import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import messaging from "@react-native-firebase/messaging";
import { sendSquawkNotification } from "./src/utils";
import executeTask from "./src/utils/SquawkerTasks";
import { Provider } from "react-redux";
import { store } from "./src/configurestore";

const LOG_TAG = "index.js";
/**
 * Set a message handler function which is called when
 * the app is in the background or terminated. In Android,
 * a headless task is created, allowing you to access the
 * React Native environment to perform tasks such as making an app squawk noise, updating
 * local storage, or sending a network request.
 *
 * https://rnfirebase.io/messaging/usage#background--quit-state-messages
 */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // There are two types of messages data messages and notification messages. Data messages
  // are handled and notification messages
  // here in setBackgroundMessageHandler when the app is in the background or killed. Data
  // messages are the type
  // traditionally used with FCM. Notification and Data messages are only received in
  // onMessage when the app
  // is in the foreground. When the app is in the background an automatically generated
  // notification is displayed.
  // When the user taps on the notification they are returned to the app. Messages
  // containing both notification
  // and data payloads are treated as notification messages. The Firebase console always
  // sends notification
  // messages. For more see: https://firebase.google.com/docs/cloud-messaging/concept-options\

  // The Squawk server always sends just *data* messages, meaning that onMessage when
  // the app is both in the foreground AND setBackgroundMessageHandler when the app is in the background

  // Check if message contains a data payload.
  if (Object.keys(remoteMessage.data).length > 0) {
    console.log(LOG_TAG, "From: ", remoteMessage.from);

    // Send a notification that you got a new message
    await sendSquawkNotification(remoteMessage.data);
    executeTask(remoteMessage.data);
  }
});

export function App() {
  const ctx = require.context("./app");

  const [isHeadless, setIsHeadless] = useState(false);

  useEffect(() => {
    // as instructed by firebase here https://rnfirebase.io/messaging/usage#background-application-state
    if (Platform.OS == "ios") {
      messaging()
        .getIsHeadless()
        .then((isHeadless) => {
          setIsHeadless(isHeadless);
        });
    }
  }, []);

  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return (
    <Provider store={store}>
      <ExpoRoot context={ctx} />
    </Provider>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
