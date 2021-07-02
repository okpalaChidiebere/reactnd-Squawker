import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context"
import messaging from "@react-native-firebase/messaging"
import { Provider as StoreProvider } from "react-redux"
import store from "./store/configureStore"
import MainNavigator from "./ui/MainNavigator"
import db, { createTable } from "./utils/DatabaseProvider"
import { colorPrimary, colorPrimaryDark } from "./utils/strings"
import { requestUserPermission, sendRegistrationToServer } from "./utils/NotificationUtils"

export default function App() {

  useEffect(() => {
    (async() => {
      createTable(db)
      await requestUserPermission()
    })()

    /**
     * Called if InstanceID token is updated. This may occur if the security of
     * the previous token had been compromised (eg un-installing the app). 
     * Note that this is called when the InstanceID token is initially generated 
     * so this is where you would retrieve the token.
     */
    const unsubscribe = messaging().onTokenRefresh(async token => {
      console.log(token)
      sendRegistrationToServer(token)
    })
    return unsubscribe
  }, [])
  return (
    <StoreProvider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={colorPrimaryDark}/>
        <MainNavigator />
      </SafeAreaView>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPrimary,
  },
});
