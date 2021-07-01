import messaging from "@react-native-firebase/messaging"
import { Linking } from "react-native"
import { component_main } from "./utils/strings"


const config = {
  screens: {
    [component_main]: "squawks",
  },
}

function subscribe(listener) {
    // Assume a message-notification contains a "url" property in the data payload of the screen to open

    const onReceiveURL = ({ url }) => listener(url)

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL)

    /**
     * When any FCM payload (Notification Message or Data Message) is received while the app is active, the listener callback
     * is called with a `RemoteMessage`. Returns an unsubscribe
     * function to stop listening for new messages.
     */
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Notification received when app is in foreground state:', remoteMessage);
    });

    /**
     * When the user presses a Notification Message displayed via FCM,
     * this listener will be called if the app has opened from
     * a background state.
     */
    messaging().onNotificationOpenedApp(async remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );

        if(remoteMessage.data.url){
            listener(remoteMessage.data.url)
        }

    });
  
    /**
     * When the user presses a Notification Message displayed via FCM,
     * this listener will be called if the app has opened from
     * a killed state. This method will return a
     * `RemoteMessage` containing the notification data, or
     * `null` if the app was opened via another method.
     */
      messaging()
        .getInitialNotification()
        .then(async remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );

            if(remoteMessage.data.url){
                listener(remoteMessage.data.url)
            }
          }
        });

    return () => {
        // Clean up the event listeners
        Linking.removeEventListener('url', onReceiveURL)
        unsubscribe()
    }
}

const linking = {
  prefixes: ["reactndsquawker://app"],
  config,
  subscribe,
}

export default linking;
