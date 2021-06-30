import React from "react"
import moment from "moment"
import { Text, View, StyleSheet, Image }  from "react-native"
import { colorText, colorSecondaryText, follow_key_switch_asser, 
    follow_key_switch_cezanne, follow_key_switch_jlin, follow_key_switch_lyla, 
    follow_key_switch_nikita, } from "../utils/strings"


export default function SquawkerListItem({ author, authorKey, message, date }){
    return (
        <View style={styles.container}>
            <Image
            style={styles.image}
            source={getInstructorImage(authorKey)}
            resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
            />
            <View style={{ flexDirection:"column", maxWidth:"85%", marginLeft: 10}}>
                <View style={{ flexDirection:"row", marginRight: 20}}>
                    <Text style={styles.primaryText}>{author}</Text>
                    <Text style={styles.secondaryText}>{getDateForDisplaying(date)}</Text>
                </View>
                <Text>{message}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems:"center",
        padding: 15,
    },
    image: {
        width: 75,
        height: 75,
        borderWidth: 2,
        borderRadius: 75,
    },
    primaryText: {
        marginRight: 10,
        color: colorText,
        fontSize: 14,
        fontWeight: "700",
    },
    secondaryText: {
        color: colorSecondaryText,
        fontSize: 14,
        fontStyle: "italic",
    },
})

/**
 * Formats the date to display
 * 
 * @param {*} dateInMillis 
 * @returns date to display with a dot at the begining
 * 
 * https://momentjs.com/docs/#/manipulating/start-of/
    https://momentjs.com/docs/#/displaying/format/
 */
function getDateForDisplaying(dateInMillis){
    const MINUTE_MILLIS = 1000 * 60
    const HOUR_MILLIS = 60 * MINUTE_MILLIS
    const DAY_MILLIS = 24 * HOUR_MILLIS

    let date = ""
    const now = moment().format('x')

    // Change how the date is displayed depending on whether it was written in the last minute,
    // the hour, etc.
    if (now - dateInMillis < (DAY_MILLIS)) {
        //if the squawk was posetd in the last hour, the number of minute is shown
        if (now - dateInMillis < (HOUR_MILLIS)) {
                date = moment(dateInMillis).startOf('minute').fromNow() //eg 24m
        } else { // here it means the squawk is made in the last day but not in the last hour
                date = moment(dateInMillis).startOf('hour').fromNow() //eg 2h
            }
    } else { //the squawk was made more than a day ago 
        date = moment(dateInMillis).format("D MMMM") //27 Jun
    }

    //add a dot to the data string purely for a visual florish
    return `\u2022 ${date}`
}

function getInstructorImage (authorKey) {
    // Choose the correct, and in this case, locally stored asset for the instructor. If there
        // were more users, you'd probably download this as part of the message.
        switch (authorKey) {
            case follow_key_switch_asser:
                return require("../assets/asser.png")
                //break;
            case follow_key_switch_cezanne:
                return require("../assets/cezanne.png")
            case follow_key_switch_jlin:
                return require("../assets/jlin.png")
            case follow_key_switch_lyla:
                return require("../assets/lyla.png")
            case follow_key_switch_nikita:
                return require("../assets/nikita.png")
            default:
                return require("../assets/test.png")
        }
}

