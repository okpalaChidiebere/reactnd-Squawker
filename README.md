# Squawker
Squawker is a social media App. It allows the users to follow the instructors of advanced android who write squawks for their fans. Squawks are short messages filled with helpful advice and reflections. If you have preferred more instructors than others, you can choose who to follow. 
When an instructor sends a squawk, everyone who is following that instructor will immediately get a notification.

I learned
- Set up Firebase for my app
- Send an FCM notification message from the Firebase console
- Add an extra data to that messge and get it from the remoteMessage payload
- Generate a registration id token for an app
- Receive data message from a server
- Follow an FCM topic

# Pushing vs Pulling
When developing a client side app, you need to decide how the data in your app will stay in sync with the remote sever.

- Polling: This is the act of continually pinging the server every so often to see if there are any updates. Eg using Task Manager and Background Fetch to schedule task to continually pinging the server.

- Pushing: The idea behind the pushing strategy is instead of having your client phone constantly asking the server if there are any updates, instead the server is responsible for telling the phone when it has new information. The server can decide what information to send down the message. Once the client app receives the message, it is up to the client app react however you want. Eg when the server sends a message that it has a new squawk, it can trigger the code to send a new squawk, re-download all the data from the server, trigger an entire database sync, or have the phone make a loud squawking noise or anything else that you like. This is always more battery efficient than polling. 


# Connect Firebase and the Squawker App
**NOTE:** Push notification never works on iOS emulators but works on Android Emulators and iOS/Android real devices/ it is mentioned [here](https://rnfirebase.io/messaging/usage#receiving-messages). Also, React-Native Firebase is not compactable with Expo Clinet yet. You one you add this your create-react-native-app, you will not be able to run it on Expo client anymore using `expo strart`. So, you either will rely on emulators or bulding your app apk to install then on real device to test. Read [this](https://docs.expo.io/guides/using-firebase/#usage-with-expo) first

- run `yarn add @react-native-firebase/app`
- run `yarn add @react-native-firebase/messaging`
- cd into  `/ios` folder and run `pod install` right away
- create a project in the [firebase console](https://console.firebase.google.com/). This early steps [video](https://www.youtube.com/watch?v=w6rQdurucCk)
- Follow the rest of the instructions [here](https://rnfirebase.io/#2-android-setup) and you are good to go.
- NOTE: appNames for Android (package) can be found at the first line of the AndroidManifest file. The appName for iOS (Bundle Identifier) can be found when you open the [project workspace](https://developer.apple.com/documentation/bundleresources/information_property_list/managing_your_app_s_information_property_list) in XCode. This [video](https://www.youtube.com/watch?v=x7kOxxJccug&t=563s) helped me see where to put the GoogleService-Info.plist file. For android it was at `android/app/google-service.json`
- I still added some config to my app.json for [expo reasons](https://docs.expo.io/guides/setup-native-firebase/#managed-workflow-setup)

In summary, For Android, you have to modify only two files
- android/app/build.gradle
- android/build.gradle

For iOS you have to modify
- ios/Podfile
- ios/reactndSquawker/AppDelegate.m
- ** dont forget to run `pod install --repo-update` in the `/ios` folder after you modified these files
- Get your APN P12 certificate add that to your iOS app in the fcm comsole. Go to Project Settings->Cloud Messaging and upload your certificate there. Watch this [video](https://www.youtube.com/watch?v=qXiayqgYrmo&t=109s) to see how to. Make sure you are enrolled to [App development program](https://developer.apple.com/programs/enroll/). It is not free :) You will have access to [this page](https://developer.apple.com/account/resources/) if you are enrolled. This certificate is NEEDED for the remote push notifcation coming from console or your own web server to work on iOS devices
- You can use [APN key](https://betterprogramming.pub/how-to-set-up-firebase-push-notifications-in-a-react-native-app-a9405af32093) if you dont want to use certificate

# Firebase JSON
You can use [this](https://rnfirebase.io/messaging/usage#firebasejson) to further configure firebase if you want

# Notification Messages vs Data Messages

- **Notification Messages:** If you want the system to show notification on your behalf whether where you need to run code in foreground, then use this type of message. Eg Advertisements, notifcation for an app without needing to run code for DB synching. It format of such message looks like [this](https://rnfirebase.io/messaging/server-integration#pulling-it-all-together). Notice that there is no data key. However, if you are sending from the console, the data key will be included, but it will be an empty object if you dont add extra data at step5 of creating a message. This will result in the mesage being received in the backgound. So write some logic at `messaging().setBackgroundMessageHandler()` whether to ignore them or not
- **Data Messages:** With Data Messages notification will not be displayed automatically. You are responsible for adding the code to process data that comes in. With `messaging().setBackgroundMessageHandler()` you will run your logic in background and you can send a local notification to notify the user if needed. With `messaging().onMessage()`, you run your logic when the app is active or in foreground. Then you can choose to send a local notification to the user or not. Read more [here](https://rnfirebase.io/messaging/usage#data-only-messages) or [here](https://rnfirebase.io/messaging/server-integration#send-messages-to-topics) on how to send data messages. The take away here is that there will be no notification displayed for you. You will have to send a local notifcation yourself if you need one.
- The FCM console sends a mixture of Notifcation and Data Message. This is the take away. But from your own web server, you can choose to send just a data-only message or notification-only message
- Use `messaging().onNotificationOpenedApp()` and `messaging().getInitialNotification()` to listen for when the notification we displayed as a result of Notification Message or a mixture of Data and Notification message (in this case, you may need to run a background and foreground task where data-only if for just background taks) was clicked. Eg in backgroud you make a server sync, and when the notification is clicked on, you run a linking code to open the appropriate screen or updating the UI
- [https://aboutreact.com/react-native-firebase-cloud-messaging/](https://aboutreact.com/react-native-firebase-cloud-messaging/)

Notification Message looks like this
```json
{
    "token": "<registration token>",
    "notification": {
        "body": "Hello world", 
        "test": "Lyla", 
    },
}

```

Data Message looks like this
```json
{
    "token": "<registration token>",
    "data": {
        "author": "TestAccount", 
        "authorKey": "key_test", 
        "date": "1625167969245", 
        "message": "Hello world"
    }, 
}

```

Mixture of Data and Notification message looks like
```json
{
    "token": "<registration token>",
    "data": {},
    "notification": {
        "body": "Hello world", 
        "test": "Lyla", 
    },
}

```
[https://firebase.google.com/docs/cloud-messaging/concept-options](https://firebase.google.com/docs/cloud-messaging/concept-options)

# Sending to Multiple Devices

There are tow ways you can do so. 
- Device Groups: These is typically a set of devices that all belong to thesame user. Eg if chid owns two phones and a tablet that all use squawker, we can store all of these devices together for that user in the device group. The will done and managed in our App server side. Read more about this [here](https://firebase.google.com/docs/cloud-messaging/android/device-group)
- Topics: This is like a mailing list. Devices will choose to subscribe to a topic and then only those devices that choose to subscribe will be sent the messages when the topic sends a message. Read more [here](https://rnfirebase.io/messaging/server-integration#send-messages-to-topics). You can [subscrbe](https://rnfirebase.io/messaging/usage#subscribing-to-topics) and [unsubscribe](https://rnfirebase.io/messaging/usage#unsubscribing-to-topics) to topics by that key! The Key that the user subscribes to and they key that the server sends the message too need to match EXACTLY.

# There's More to Learn about FCM
- How to write server code for FCM server
- How to manage registration id tokens or groups on a server. This [article](https://zainmanji.medium.com/how-to-structure-firebase-push-notifications-in-your-react-native-app-6847712d1c31) explains how to do it
- How to deal with Upstream messages (where you send a message to FCM to send to other devices)
- Learn about other message attributs like Message Lifespan (How long FCM will try to re-ping your device if its offline), Message Priority (determines whether to wake up your phone if it in doze mode), Collapsible/Non-collapsible Messages (Collasible message are replaced when a new message is sent. Eg lets say your phone is off and everytime you get a new email, an FCM tells your phone will have to sync with the server. If your phone is a sleep, you dont need to tell your phone to sync a 100 times when it is powered back on. You just need to tell it to sync once)
- Learn how to fully sync your device with the server. In this Squawker App, we simply just save the new message in our local DB. We could add in this Squawker app to do a full database sync when you follow a new instructor so that you get all their messages you might have missed

# Other useful Resources
- Documentation about how messages are sent from FCM to client is [here](https://firebase.google.com/docs/cloud-messaging/concept-options)
- Sending a push notification from the a user React-Native app to another React-Native app [here](https://firebase.googleblog.com/2016/08/sending-notifications-between-android.html)
- [https://rnfirebase.io/messaging/server-integration](https://rnfirebase.io/messaging/server-integration)
- [https://aboutreact.com/react-native-firebase-cloud-messaging/](https://aboutreact.com/react-native-firebase-cloud-messaging/) has how to add AdMod as well :)