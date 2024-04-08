import { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import * as SecureStore from "expo-secure-store";
import messaging from "@react-native-firebase/messaging";
import { colorText, colorSecondaryText, colorAccent } from "../utils/strings";

interface SwitchPreferenceProps {
  title: string;
  value: boolean;
  summaryOff: string;
  summaryOn: string;
  prefKey: string;
}
export const SwitchPreference: React.FC<SwitchPreferenceProps> = (props) => {
  const { title, value, summaryOff, summaryOn, prefKey } = props;
  const [isEnabled, setIsEnabled] = useState(value);

  const setOnSwitchChangeListener = async (isOn: boolean) => {
    setIsEnabled(isOn);
    await SecureStore.setItemAsync(prefKey, isOn.toString());

    if (isOn) {
      await messaging().subscribeToTopic(prefKey);
    } else {
      await messaging().unsubscribeFromTopic(prefKey);
    }
  };

  return (
    <View style={styles.wrapperCustom}>
      <View style={styles.preferenceRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}> {isEnabled ? summaryOn : summaryOff}</Text>
      </View>
      <Switch
        trackColor={{ true: "#cee6b3", false: "#9d959d" }}
        thumbColor={isEnabled ? colorAccent : "#e7e4e7"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={(v) => setOnSwitchChangeListener(v)}
        value={isEnabled}
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colorText,
    fontSize: 20,
  },
  value: {
    color: colorSecondaryText,
    fontSize: 14,
  },
  preferenceRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 20,
    paddingLeft: 50,
  },
  wrapperCustom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switch: {
    margin: 20,
  },
});
