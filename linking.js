import messaging from "@react-native-firebase/messaging"
import * as Notifications from "expo-notifications"
import { Linking } from "react-native"
import { component_main } from "./utils/strings"
import executeTask from "./utils/SquawkerTasks"


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
     * Called when user clicks on notifications displayed by expo.
     *
     * @param response Object representing the message received from Firebase Cloud Messaging
     */
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {

      const url = response.notification.request.content.data.url //this url will as our pending intent to open a particular screen in our app
      // Let React Navigation handle the URL if any
      if(url){
        listener(url)
      }
    })

    /**
     * Called when message is received when our app is in the foreground
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging
     * @return an method used to stop listening for messages
     */
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      executeTask(remoteMessage.data)
    });

    /**
     * Called when user clicks on notification displayed by FCM when our app is in background.
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging
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
     * Called when user clicks on notification displayed by FCM when our app has been terminated.
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging
     * remoteMessage will be null if the app was opened via another method
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
        subscription.remove()
    }
}

const linking = {
  prefixes: ["reactndsquawker://app"],
  config,
  subscribe,
}

export default linking;
