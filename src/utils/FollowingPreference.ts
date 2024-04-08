import * as SecureStore from "expo-secure-store";
import {
  follow_summary_following,
  follow_summary_not_following,
} from "./strings";
import { follow_default_message_subscription } from "./bool";
import {
  FollowingPreference,
  SquawkerInstructors,
  SquawkerInstructorsKeys,
} from "./types";

export const SQUAWKER_PREFERENCES_BASE = "squawker.preferences";

export function getFollowingPreference(key: string) {
  return (
    SecureStore.getItem(key) === "true" || follow_default_message_subscription
  );
}

export function getFollowingPreferences(): FollowingPreference[] {
  // AsyncStorage.clear() //used to clear our preference storage. Used for Debugging

  const following = Object.keys(SquawkerInstructors).map(
    (prefKey: SquawkerInstructorsKeys) => ({
      //contains any information that will help us build the UI for our specific preference
      title: SquawkerInstructors[prefKey],
      prefKey,
      value: getFollowingPreference(prefKey),
      summaryOff: follow_summary_not_following,
      summaryOn: follow_summary_following,
    })
  );

  return following;
}
