import messaging from "@react-native-firebase/messaging"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import { notification_title, main_notification_channel_name, colorPrimary } from "./strings"

const NOTIFICATION_MAX_CHARACTERS = 30
const SQUAWKER_NOTIFICATION_CHANNEL_ID = "squawks_notification_channel"
const SQUAWKER_NOTIFICATION_ID = (1138).toString()

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, //for sunshine, the app is running, so no need to show alert. You may want this one like football scores app does.
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
})

export async function requestUserPermission() {

    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
        alert("Go to the Settings page to enable push notification for complete Squawker experience")
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus;
    if (existingStatus === 'undetermined') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Go to the Settings page to enable push notification for complete Squawker experience')
        return;
    }
    
    //Since Android O, you not allowed to send a notification, without assigning it to a channel
    if (Platform.OS === 'android') {
        const channel = await Notifications.getNotificationChannelAsync(SQUAWKER_NOTIFICATION_CHANNEL_ID)

        //If the channel has not been configured, then we configure one!
        if(!channel){
            Notifications.setNotificationChannelAsync(SQUAWKER_NOTIFICATION_CHANNEL_ID, {
                name: main_notification_channel_name, 
                importance: Notifications.AndroidImportance.HIGH,
            })
        }
    }
}
  
/**
* Persist token to third-party servers.
* 
* Modify this method to associate the user's FCM InstanceID token with any server-side account
* maintained by your application.
*
* @param token The new token.
*/
export async function sendRegistrationToServer(token){
    
}

/**
* Create and show a simple notification containing the received FCM message
*
* @param data map which has the message data in it
*/
export async function sendNotification(data){

    const title = notification_title(data.author)
    const notificationContent = BuildNotificationContent(SQUAWKER_NOTIFICATION_CHANNEL_ID, title, data.message, data)

    await Notifications.scheduleNotificationAsync(createNotificationRequest(SQUAWKER_NOTIFICATION_ID, notificationContent, null))

    return
}

/**
* This method will return a NotificatioRequest.
*
* @param identifier Unique Id that defines this notification. Helps you cancel this notification at a later time
* @param content The notification content
* @param trigger You can pass in a triggerDate to schedule the notification or null to send the notification right away
*
* @return The Notification request
https://docs.expo.io/versions/v41.0.0/sdk/notifications/#notificationrequest
*/
function createNotificationRequest (identifier, content, trigger) {
    return {
        identifier,
        content,
        trigger, //null will trigger this notification right away
    }
}

function BuildNotificationContent (categoryIdentifier, title, body, data = { url: "reactndsquawker://app/squawks" }) {
    return {
        categoryIdentifier, //This help you attach action(s) to your notification when needed
        title,
        // If the message is longer than the max number of characters we want in our
        // notification, truncate it and add the unicode character for ellipsis
        body: body.length > NOTIFICATION_MAX_CHARACTERS ? body.substring(0, NOTIFICATION_MAX_CHARACTERS)+"\u2026" : body,
        data,
        sound: 'default',
        ...Platform.select({
            android:{
                vibrate: true,
                color: colorPrimary,
                autoDismiss: true,
                priority: Notifications.AndroidImportance.HIGH,
            },
        })
    }
}