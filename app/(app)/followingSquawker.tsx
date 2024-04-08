import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwitchPreference } from "../../src/components/SwitchPreference";
import { FollowingPreference, getFollowingPreferences } from "../../src/utils";

export default function Page() {
  const [followingSquawker, setFollowingSquawker] = useState<
    FollowingPreference[]
  >([]);

  useEffect(() => {
    const following = getFollowingPreferences();
    setFollowingSquawker(following);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {followingSquawker.length === 0 ? (
        //we just show a loading indicator if the state is not yet initialized apart from default values
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            style={{ marginTop: 30 }}
            size="large"
            color="#d9d9d9"
          />
        </View>
      ) : (
        <ScrollView>
          {followingSquawker.map(
            ({ title, value, summaryOff, summaryOn, prefKey }) => (
              <SwitchPreference
                key={prefKey}
                title={title}
                value={value}
                summaryOff={summaryOff}
                summaryOn={summaryOn}
                prefKey={prefKey}
              />
            )
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
