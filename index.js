import messaging from "@react-native-firebase/messaging"
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

/**
* Set a message handler function which is called when
* the app is in the background or terminated. In Android,
* a headless task is created, allowing you to access the
* React Native environment to perform tasks such as making an app squawk noise, updating
* local storage, or sending a network request.
* 
* https://rnfirebase.io/messaging/usage#background--quit-state-messages
*/
messaging().setBackgroundMessageHandler(async remoteMessage => {

    if(remoteMessage.notification){
        console.log('Notification Message handled in the background!', remoteMessage)
        //This type of message usually comes from the fcm console or server; so notifcation will be displayed automatically for us to the user
    }else{
        console.log('Data Message handled in the background!', remoteMessage)
        //here noitication will not be displayed to the user automatically. We will have to send a local push notification ourself if we NEED to
        //we can ONLY send this type of message ffrom our own remote server and not fcm console
    }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
