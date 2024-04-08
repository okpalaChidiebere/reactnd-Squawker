# Squawker

Squawker is a social media App. It allows the users to follow the instructors of advanced android who write squawks for their fans. Squawks are short messages filled with helpful advice and reflections. If you have preferred more instructors than others, you can choose who to follow.
When an instructor sends a squawk, everyone who is following that instructor will immediately get a notification.

I learned

- Set up Firebase for my app
- Send an FCM notification message from the Firebase console
- Add an extra data to that message and get it from the remoteMessage payload
- Generate a registration id token for an app
- Receive data message from a server
- Follow an FCM topic

# Pushing vs Pulling

When developing a client side app, you need to decide how the data in your app will stay in sync with the remote sever.

- Polling: This is the act of continually pinging the server every so often to see if there are any updates. Eg using Task Manager and Background Fetch to schedule task to continually pinging the server.

- Pushing: The idea behind the pushing strategy is instead of having your client phone constantly asking the server if there are any updates, instead the server is responsible for telling the phone when it has new information. The server can decide what information to send down the message. Once the client app receives the message, it is up to the client app react however you want. Eg when the server sends a message that it has a new squawk, it can trigger the code to send a new squawk, re-download all the data from the server, trigger an entire database sync, or have the phone make a loud squawking noise or anything else that you like. This is always more battery efficient than polling.

# Connect Firebase and the Squawker App

**NOTE:** Push notification never works on iOS emulators but works on Android Emulators and iOS/Android real devices/ it is mentioned [here](https://rnfirebase.io/messaging/usage#receiving-messages). Also, React-Native Firebase and Notifee are not compactable with Expo Client. You one you add this your create-expo-app with minimal workflow template, you will not be able to run it on Expo Go when you run `npx expo start`. So, you will be using emulators or standalone app on real device to install and test your app. Read [this](https://docs.expo.io/guides/using-firebase/#usage-with-expo) first
\*\* I watched this [https://www.youtube.com/watch?v=dyAwv9HLS60](https://www.youtube.com/watch?v=dyAwv9HLS60) and saw notifications work on emulators. So maybe check it out

- run `npx expo install expo-build-properties expo-dev-client @react-native-firebase/app @react-native-firebase/messaging @notifee/react-native`
- Add `@react-native-firebase/app` to plugins for expo config file. This is useful for EAS build can add the firebase native code.

```json
{
    ...
    "plugins": [
        ...
        "@react-native-firebase/app",
        [
            // For iOS, additional configurations are required due to firebase-ios-sdk's use_frameworks dependency. Configure expo build properties for eas build to work properly
            "expo-build-properties",
            {
                "ios": {
                    "useFrameworks": "static"
                }
            }
       ],
    ],
}
```

You need the `expo-build-properties` for the eas build for the static Firebase library for ios. This is a well know [issue](https://github.com/invertase/react-native-firebase/issues/6332#issuecomment-1602461404)

We added `expo-dev-client` because since React Native Firebase requires custom native code, you need to install the expo-dev-client library in your project. It also allows configuring any native code required by React Native Firebase using Config plugins without writing native code yourself. So we can test our app using [EAS](https://docs.expo.dev/build/setup/) development build

For Android

- create a project in the [firebase console](https://console.firebase.google.com/).
- Follow all the steps from this [expo instructions](https://docs.expo.dev/push-notifications/fcm-credentials/) or the early steps in this [video](https://www.youtube.com/watch?v=w6rQdurucCk)
- NOTE: appNames for Android (package) name must match the package name in app.json file.
- So your `app.json` should look something like this

```json
{
    ...
    "android": {
        "googleServicesFile": "./google-services.json", // this file must be in git to work. If this file is in gitignore, the EAS build will fail because firebase checks for it. This is not a confidential file anyway; so not need to add it to gitignore
        "package": "com.reactndsquawker",
    }
    ...
}
```

- And you are good to go!

For IOS (You see this [link](https://medium.com/@arashfallahi1989/how-to-integrate-firebase-push-notification-in-react-native-expo-bd5cc694f181) or [link](https://rnfirebase.io/messaging/usage/ios-setup))

- Go to your Apple Developer [account](https://developer.apple.com/account). If you don't have an account yet, you can [enroll](https://developer.apple.com/programs/enroll/)
- create a project in the [firebase console](https://console.firebase.google.com/).
- Then Certificates, Identifiers & Profiles — https://developer.apple.com/account/resources/authkeys/list
- Click `keys` and add new key. I prefer to use APN key. Another option is to use APN Certification.
- Add new `key` and from the list check push `Apple Push Notifications service (APNs)`
- `Continue` and `register`
- Finally copy `key ID` and `Download` configuration
- You can now include the file and `Key ID` in your [Firebase Project](https://console.firebase.google.com/). To do this, go to the Project settings on the Firebase Console In the overview link page and click on the `Add app` button and create an iOS app.
- On the Firebase Console and open the Cloud Messaging tab, find your iOS app configuration under the iOS app configuration section
- Upload the downloaded file and provide the **_`Key ID`_** and **_`Team ID`_** in the appropriate fields. Team ID can be found [here](https://developer.apple.com/account) in the Membership details

**For iOS build production**, When building your app for production, you’ll need to create a new App Identifier that is linked to the application you’re developing in order for messaging to work properly. Follow these steps:

- On the `Certificates, Identifiers & Profiles` page, click on `Identifiers` and register a new App Identifier (must be thesame name as the ios identifier in the app.json).
- Select `App IDs` and click `Continue`.
- Scroll down to the `Push Notifications` capability (as well as any others your app requires) and enable it, then click Continue.
- Update your app.json to
- [https://rnfirebase.io/messaging/usage/ios-setup#3-generating-a-provisioning-profile](https://rnfirebase.io/messaging/usage/ios-setup#3-generating-a-provisioning-profile)
- [4.2.3. Generating a provisioning profile](https://medium.com/@arashfallahi1989/how-to-integrate-firebase-push-notification-in-react-native-expo-bd5cc694f181)
- [A STEP-BY-STEP FIREBASE AND EXPO INTEGRATION GUIDE](https://ft.ro/blog/background-notifications-in-react-native-a-step-by-step-firebase-and-expo-integration-guide)
- [https://medium.com/@ashoniaa/react-native-expo-push-notifications-with-fcm-a-step-by-step-guide-fa5cfc0372fd](https://medium.com/@ashoniaa/react-native-expo-push-notifications-with-fcm-a-step-by-step-guide-fa5cfc0372fd)

```json
{
  ...
  "ios": {
    "bundleIdentifier": "com.reactndsquawker",
    "googleServicesFile": "./GoogleService-Info.plist", // this file must be in git to work. If this file is in gitignore, the EAS build will fail because firebase checks for it. This is not a confidential file anyway; so not need to add it to gitignore
    "infoPlist": {
        "UIBackgroundModes": [
            "fetch",
            "remote-notification"
        ],
        "NSUserNotificationsUsageDescription": "Customer message to Apple why you need the notification permission",
    }
  }
  ...
}
```

If you have not used your project in a long while, the `GoogleService-Info.plist` and `google-service.json` might expire. You will have to generate new ones. No big deal

If you want to follow the go through expo for push notifications watch this [video](https://www.youtube.com/watch?v=cziFOUtXxrQ&t=1579s)

# Testing remote Push Notifications For Android

- There are no extra configuration to do other than adding your `google-service.json` android to the project and adding code to listen for messages sent out by firebase. Push notifications works for Simulators and real devices as long as you get the token respectively
- Use EAS to build the app locally for development or preview and use `adb` to install `.apk` file to simulators or device!

# Testing remote Push Notifications For iOS

- No extra configurations needed other than adding your `GoogleService-Info.plist` gotten from fcm console to iOS
- Simulators do not receive push messages sent out using the FCM api. But you can still test out the notification by creating an APNS file. eg `TestPush.apns` extension and dragging (from the folder) and dropping that file into the the simulator. See [Here](https://medium.com/@expertappdevs/push-notifications-in-the-ios-simulator-d0267cacc0eb) and [Here](https://stackoverflow.com/questions/66040828/can-you-receive-fcm-push-notification-from-ios-simulator). **Note** The only limitation is that it only the foreground notification listeners like `onMessage` for firebase and `onForegroundEvent`, `getInitialNotification` for [notifee](https://notifee.app/react-native/docs/installation) works
- For Reals device, Everything works just fine. When you are building for and the terminal prompt you to add Push notification just say `No` because we are not using Expo push notifications. We set everything in our [FCM](https://console.firebase.google.com/) to do this fot us

# Firebase JSON

You can use [this](https://rnfirebase.io/messaging/usage#firebasejson) to further configure firebase if you want

# Notification Messages vs Data Messages

- **Notification Messages:** If you want the system to show notification on your behalf whether where you need to run code in foreground, then use this type of message. Eg Advertisements, notification for an app without needing to run code for DB synching. It format of such message looks like [this](https://rnfirebase.io/messaging/server-integration#pulling-it-all-together). Notice that there is no data key. However, if you are sending from the console, the data key will be included, but it will be an empty object if you don't add extra data at step5 of creating a message. This will result in the message being received in the background. So write some logic at `messaging().setBackgroundMessageHandler()` whether to ignore them or not
- **Data Messages:** With Data Messages notification will not be displayed automatically. You are responsible for adding the code to process data that comes in. With `messaging().setBackgroundMessageHandler()` you will run your logic in background and you can send a local notification to notify the user if needed. With `messaging().onMessage()`, you run your logic when the app is active or in foreground. Then you can choose to send a local notification to the user or not. Read more [here](https://rnfirebase.io/messaging/usage#data-only-messages) or [here](https://rnfirebase.io/messaging/server-integration#send-messages-to-topics) on how to send data messages. The take away here is that there will be no notification displayed for you. You will have to send a local notification yourself if you need one.
- The FCM console sends a mixture of Notification and Data Message. This is the take away. But from your own remote server, you can choose to send just a data-only message or notification-only message
- [https://aboutreact.com/react-native-firebase-cloud-messaging/](https://aboutreact.com/react-native-firebase-cloud-messaging/)
- [https://rnfirebase.io/messaging/usage#notifications](https://rnfirebase.io/messaging/usage#notifications)

Notification Message looks like this

```json
{
  "token": "<registration token>",
  "notification": {
    "body": "Hello world",
    "test": "Lyla"
  }
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
  }
}
```

Mixture of Data and Notification message looks like

```json
{
  "token": "<registration token>",
  "data": {},
  "notification": {
    "body": "Hello world",
    "test": "Lyla"
  }
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

- [More on Notifee](https://www.notjust.dev/blog/2023-02-02-react-native-local-push-notifications)
- Documentation about how messages are sent from FCM to client is [here](https://firebase.google.com/docs/cloud-messaging/concept-options)
- Sending a push notification from the a user React-Native app to another React-Native app [here](https://firebase.googleblog.com/2016/08/sending-notifications-between-android.html)
- [https://rnfirebase.io/messaging/server-integration](https://rnfirebase.io/messaging/server-integration)
- [https://aboutreact.com/react-native-firebase-cloud-messaging/](https://aboutreact.com/react-native-firebase-cloud-messaging/) has how to add AdMod as well :)
