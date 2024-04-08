import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import uuid from "react-native-uuid";
import * as Linking from "expo-linking";
import * as Application from "expo-application";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import messaging from "@react-native-firebase/messaging";
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  NotificationSettings,
  Notification,
  EventType,
  EventDetail,
} from "@notifee/react-native";
import {
  notification_title,
  main_notification_channel_name,
  colorPrimary,
} from "./strings";
import { SQUAWKER_PREFERENCES_BASE } from "./FollowingPreference";
import { SaveDevice } from "./NetworkUtils";
import executeTask from "./SquawkerTasks";

const NOTIFICATION_MAX_CHARACTERS = 30;
const SQUAWKER_NOTIFICATION_CHANNEL_ID = "squawks_notification_channel";
const SQUAWKER_NOTIFICATION_ID = (1138).toString();
const DEVICE_UNIQUE_ID_kEY = SQUAWKER_PREFERENCES_BASE + `.deviceId`;

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // console.log("notificationUtils.js", { type });
  //You can handle other event here including when a message is received from fcm when app is in background

  // listen for when the user taps on the notification while app is in background.
  if (type === EventType.PRESS && pressAction.id === "default") {
    redirect(notification);
  }
});

export async function requestNotificationPermission() {
  let finalStatus: NotificationSettings;

  const settings = await notifee.getNotificationSettings();
  finalStatus = settings;
  if (!settings.authorizationStatus) {
    const settings = await notifee.requestPermission({
      alert: true,
      sound: true,
      badge: false,
    });
    finalStatus = settings;
  }

  if (finalStatus.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    //Since Android O, you not allowed to send a notification, without assigning it to a channel
    if (Platform.OS === "android") {
      const channel = await notifee.getChannel(
        SQUAWKER_NOTIFICATION_CHANNEL_ID
      );

      //If the channel has not been configured, then we configure one!
      if (!channel) {
        await notifee.createChannel({
          id: SQUAWKER_NOTIFICATION_CHANNEL_ID,
          name: main_notification_channel_name,
          importance: AndroidImportance.HIGH,
        });
      }
    }
  }

  return finalStatus;
}

export async function isNotificationAllowed() {
  const settings = await notifee.getNotificationSettings();
  return (
    settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED ||
    settings.ios.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
}

/**
 * Persist token to third-party servers.
 *
 * Modify this method to associate the user's FCM InstanceID token with any server-side account
 * maintained by your application.
 *
 * @param token The new token.
 */
export async function sendRegistrationToServer(token: string) {
  if (!Device.isDevice && Platform.OS === "ios") {
    throw new Error("Must use physical device for Push Notifications");
  }

  const deviceId = await getDeviceId();
  //save device to our remote sever
  await SaveDevice({
    deviceId,
    token,
    active: true,
  });

  console.log(JSON.stringify({ token }));
}

/**
 * Create and show a simple notification containing the received FCM message
 *
 * @param data map which has the message data in it
 */
export async function sendSquawkNotification(data: Record<string, any>) {
  const message = data.message;

  await notifee.displayNotification({
    title: notification_title(data.author),
    body:
      message > NOTIFICATION_MAX_CHARACTERS
        ? message.substring(0, NOTIFICATION_MAX_CHARACTERS) + "\u2026"
        : message,
    id: SQUAWKER_NOTIFICATION_ID,
    data,
    android: {
      sound: "default",
      autoCancel: true,
      channelId: SQUAWKER_NOTIFICATION_CHANNEL_ID,
      color: colorPrimary,
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: "default",
      },
      //   smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
    },
    ios: {
      sound: "default",
    },
  });
}

export function useNotificationObserver() {
  const subscriptions = useRef<(() => void)[]>([]);

  useEffect(() => {
    /**
     * Called when user clicks on local notification when our app is opened from a killed state.
     *
     * @return remoteMessage Object representing the message received from Firebase Cloud Messaging
     */
    const bootstrap = async () => {
      const initialNotification = await notifee.getInitialNotification();

      if (
        initialNotification &&
        initialNotification.pressAction.id === "default"
      ) {
        console.log(
          "Notification caused application to open",
          initialNotification.notification
        );
        redirect(initialNotification.notification);
      }
    };
    bootstrap();

    /**
     * Called if InstanceID token is updated. This may occur if the security of
     * the previous token had been compromised (eg un-installing the app).
     * Note that this is called when the InstanceID token is initially generated
     * so this is where you would retrieve the token.
     */
    const unsubscribe1 = messaging().onTokenRefresh(async (token) => {
      sendRegistrationToServer(token);
    });
    subscriptions.current.push(unsubscribe1);

    /**
     * Called when message is received when our app is in the foreground
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging
     * @return an method used to stop listening for messages
     */
    const unsubscribe2 = messaging().onMessage(async (remoteMessage) => {
      // console.log("Foreground", remoteMessage.data);
      executeTask(remoteMessage.data);
    });
    subscriptions.current.push(unsubscribe2);

    /**
     * Called when user clicks on local notification when our app is foreground.
     *
     * @return remoteMessage Object representing the message received from Firebase Cloud Messaging
     */
    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          console.log("User pressed notification", detail.notification);
          redirect(detail.notification);
          break;
      }
    });

    return () => {
      subscriptions.current.forEach((remove) => remove());
    };
  }, []);
}

/** Dismiss any notifications that we have created with our BentlyAuto app */
async function clearAllNotifications() {
  return await notifee.cancelDisplayedNotifications();
}

function redirect(notification: Notification) {
  const { url = "reactndsquawker://index" } = notification.data;

  Linking.openURL(url as string);
  clearAllNotifications();
}

async function getDeviceId() {
  const newUniqueId =
    Platform.OS === "android"
      ? Application.getAndroidId() ?? uuid.v4().toString()
      : (await Application.getIosIdForVendorAsync()) ?? uuid.v4().toString();

  let eUniqueId = SecureStore.getItem(DEVICE_UNIQUE_ID_kEY);
  if (eUniqueId) {
    return eUniqueId;
  }

  await SecureStore.setItemAsync(DEVICE_UNIQUE_ID_kEY, newUniqueId);

  return newUniqueId;
}
