import AsyncStorage from "@react-native-async-storage/async-storage"
import { follow_summary_following, follow_summary_not_following, follow_title_switch_asser, follow_key_switch_asser,
    follow_title_switch_cezanne, follow_key_switch_cezanne, follow_title_switch_jlin, follow_key_switch_jlin, 
    follow_key_switch_lyla, follow_title_switch_lyla, follow_key_switch_nikita, follow_title_switch_nikita } from "./strings"
import { follow_default_message_subscription } from "./bool"


const SQUAWKER_PREFERENCES_ASYNCSTORAGE_KEY = "squawker.preferences"

async function getDefaultSharedPreferences(prefKey){
    const prefs = await AsyncStorage.getItem(SQUAWKER_PREFERENCES_ASYNCSTORAGE_KEY)

    if(!prefs)
        return follow_default_message_subscription //early return

    return JSON.parse(prefs)[prefKey] ? JSON.parse(prefs)[prefKey] : follow_default_message_subscription
}

export async function getFollowingPreference(key) {
    return await getDefaultSharedPreferences(key)
}

export function setFollowingPreference(prefKey, value) {
    return AsyncStorage.mergeItem(SQUAWKER_PREFERENCES_ASYNCSTORAGE_KEY, JSON.stringify({
        [prefKey]: value
    }))
}

export async function getFollowingPreferences(){
    // AsyncStorage.clear() //used to clear our preference storage. Used for Debugging

    const following = [
        { //contains any information that will help us build the UI for our specific preference
            title: follow_title_switch_asser,
            prefKey: follow_key_switch_asser,
            value: await getFollowingPreference(follow_key_switch_asser),
            summaryOff: follow_summary_not_following,
            summaryOn : follow_summary_following,
        }, 
        {
            title: follow_title_switch_cezanne,
            prefKey: follow_key_switch_cezanne,
            value: await getFollowingPreference(follow_key_switch_cezanne),
            summaryOff: follow_summary_not_following,
            summaryOn : follow_summary_following,
        },
        {
            title : follow_title_switch_jlin,
            prefKey: follow_key_switch_jlin,
            value: await getFollowingPreference(follow_key_switch_jlin), 
            summaryOff: follow_summary_not_following,
            summaryOn : follow_summary_following,
        },
        {
            title : follow_title_switch_lyla,
            prefKey: follow_key_switch_lyla,
            value: await getFollowingPreference(follow_key_switch_lyla), 
            summaryOff: follow_summary_not_following,
            summaryOn : follow_summary_following,
        },
        {
            title : follow_title_switch_nikita,
            prefKey: follow_key_switch_nikita,
            value: await getFollowingPreference(follow_key_switch_nikita), 
            summaryOff: follow_summary_not_following,
            summaryOn : follow_summary_following,
        },
    ]


    return following
}