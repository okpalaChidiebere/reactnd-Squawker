import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context"
import messaging from "@react-native-firebase/messaging"
import MainNavigator from "./ui/MainNavigator"
import db, { createTable } from "./utils/DatabaseProvider"
import { colorPrimary, colorPrimaryDark } from "./utils/strings"
import { registerForPushNotificationsAsync, sendRegistrationToServer } from "./utils/NotificationUtils"

export default function App() {

  useEffect(() => {
    createTable(db)
    registerForPushNotificationsAsync().then(token => sendRegistrationToServer(token))

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      sendRegistrationToServer(token)
    })
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={colorPrimaryDark}/>
      <MainNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPrimary,
  },
});
