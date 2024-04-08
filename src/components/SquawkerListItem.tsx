import { memo, useCallback, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from "react-native";
import {
  FormatDistanceStrictOptions,
  format,
  formatDistanceToNowStrict,
} from "date-fns";
import { enCA } from "date-fns/locale";
import { colorText, colorSecondaryText } from "../utils/strings";
import { squawk_list_item_height } from "../utils/dimens";
import { Squawk, SquawkerInstructorsKeys } from "../utils";

const ListItem: React.FC<Squawk> = (props) => {
  const { author, authorKey, date, message, timeTextContext } = props;
  const actualLines = useRef(null);
  const [defaultLines, setDefaultLines] = useState(5);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      //we get the actual number of lines for the text view
      actualLines.current = e.nativeEvent.lines.length;
    },
    []
  );
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={getInstructorImage(authorKey)}
        resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
      />
      <View style={{ flexDirection: "column", flex: 1, marginLeft: 10 }}>
        <View style={{ flexDirection: "row", marginRight: 20 }}>
          <Text style={styles.primaryText}>{author}</Text>
          <Text style={styles.secondaryText}>
            {timeTextContext || getDateForDisplaying(date)}
          </Text>
        </View>
        <Text
          onPress={() => setDefaultLines(actualLines.current)}
          numberOfLines={defaultLines}
          onTextLayout={onTextLayout}
        >
          {message}
        </Text>
      </View>
    </View>
  );
};

export const SquawkerListItem = memo(ListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    minHeight: squawk_list_item_height,
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
});

/**
 * Formats the date to display
 *
 * @param {*} date
 * @returns date to display with a dot at the begining
 *
 */
export function getDateForDisplaying(date: Date | number): string {
  const options: FormatDistanceStrictOptions = {
    locale: {
      ...enCA,
      // Change how the date is displayed depending on whether it was written in the last minute,
      // the hour, etc.
      formatDistance: (unit, count) => {
        switch (unit) {
          // here it means the squawk is made in the last day but not in the last hour
          case "xHours":
          case "aboutXHours":
            return `${count}h`;
          //if the squawk was posted in the last hour, the number of minute is shown
          case "xMinutes":
          case "lessThanXMinutes":
            return `${count}m`;
          //if the squawk was posted in the last minutes, the number of seconds is shown
          case "lessThanXSeconds":
          case "xSeconds": {
            if (count == 0) {
              return `now`;
            } else {
              return `${count}s`;
            }
          }
        }

        //the squawk was made more than a day ago
        return format(date, "d LLL");

        // return "%d hours";
      },
    },
  };

  return `\u2022 ${formatDistanceToNowStrict(date, options)}`;
}

function getInstructorImage(authorKey: SquawkerInstructorsKeys) {
  // Choose the correct, and in this case, locally stored asset for the instructor. If there
  // were more users, you'd probably download this as part of the message.
  switch (authorKey) {
    case "key_asser":
      return require("../../assets/asser.png");
    case "key_cezanne":
      return require("../../assets/cezanne.png");
    case "key_jlin":
      return require("../../assets/jlin.png");
    case "key_lyla":
      return require("../../assets/lyla.png");
    case "key_nikita":
      return require("../../assets/nikita.png");
    default:
      return require("../../assets/test.png");
  }
}
