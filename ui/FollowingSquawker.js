import React, { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { app_name, colorPrimary } from "../utils/strings"
import SwitchPreference from "./SwitchPreference"
import {  getFollowingPreferences } from "../utils/FollowingPreference"


export default function FollowingSquawker({ }){

    const [follwingSquawkwer, setFollwingSquawkwer] = useState([])

    useEffect(() => {
        (async () => {
            const following = await getFollowingPreferences()
            setFollwingSquawkwer(following)
        })()
    }, [])

    //we just show a loading indicator if the state is not yet initilized apart from default values
    if(follwingSquawkwer.length === 0){
        return <View style={{flex: 1, justifyContent: "center", alignItems:"center"}}><ActivityIndicator style={{marginTop: 30}} size="large" color="#d9d9d9"/></View>

    }
    return (
        <View style={styles.container}>
            <ScrollView>
            {follwingSquawkwer.map(({ title, value, summaryOff, summaryOn, prefKey }) => (
                <SwitchPreference 
                    key={prefKey} 
                    title={title}
                    value={value}
                    summaryOff={summaryOff}
                    summaryOn={summaryOn}
                    prefKey={prefKey}
                />
            ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
})

export function FollowingSquawkerOptions({ route, navigation }) {

    return {
        title: app_name,
        headerTintColor: '#fff',
        headerStyle: { 
            backgroundColor: colorPrimary,
        },
    }
}