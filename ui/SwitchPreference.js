import React, { useState } from "react"
import { View, Text, StyleSheet, Switch } from "react-native"
import { colorText, colorSecondaryText, colorAccent } from "../utils/strings"
import { setFollowingPreference } from "../utils/FollowingPreference"

export default function SwitchPreference({ title, value, summaryOff, summaryOn, prefKey }){

    const [isEnabled, setIsEnabled] = useState(value);

    const setOnSwitchChangeListener = (isOn) => {
        setIsEnabled(isOn)
        setFollowingPreference(prefKey, isOn)
    }

    return (
        <View style={styles.wrapperCustom}>
            <View style={styles.preferenceRow}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.value}> {isEnabled ? summaryOn : summaryOff}</Text>
            </View>
            <Switch
                trackColor={{ true: "#cee6b3", false: "#9d959d"}}
                thumbColor={isEnabled ? colorAccent : "#e7e4e7"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(v) => setOnSwitchChangeListener(v)}
                value={isEnabled}
                style={styles.switch}
            />
        </View>
    )
}

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
        alignItems:"center",
        justifyContent: 'space-between',
    },
    switch: {
        margin: 20,
    },
})