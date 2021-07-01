import messaging from "@react-native-firebase/messaging"

export async function requestUserPermission() {

    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
        alert("Go to the Settings page to enable push notification for complete Squawker experience")
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