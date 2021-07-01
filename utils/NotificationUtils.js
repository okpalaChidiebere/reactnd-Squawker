import messaging from "@react-native-firebase/messaging"
import { Platform } from "react-native"

export async function registerForPushNotificationsAsync() {

    if(Platform.OS == 'ios') {
        await messaging().registerDeviceForRemoteMessages()
    }

    const fcmToken = await messaging().getToken()
    return fcmToken
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
    //console.log(token)
}