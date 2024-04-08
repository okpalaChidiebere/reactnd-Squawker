import React, {
  useRef,
  useMemo,
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Stack, router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite/next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createSelector } from "@reduxjs/toolkit";
import {
  createSelectionFormAllSquawks,
  white,
  colorDivider,
  colorText,
  squawk_list_item_height,
  squawk_list_item_separator_height,
  screen_following,
  Squawk,
} from "../../src/utils";
import { useStoreDispatch, useStoreSelector } from "../../src/configurestore";
import { receiveSquawks, selectSquawks } from "../../src/reducers";
import { SquawkerListItem, getDateForDisplaying } from "../../src/components";

export default function page() {
  const lastTimeUpdate = useRef<number>(0);
  const updateIntervalId = useRef<NodeJS.Timeout>(null);
  const db = useSQLiteContext();
  const dispatch = useStoreDispatch();

  const timesUpdate = useCallback((squawks: Squawk[]) => {
    return squawks.map((squawk) => {
      return {
        ...squawk,
        timeTextContext: getDateForDisplaying(squawk.date),
      };
    });
  }, []);

  const sortedSquawks = createSelector(selectSquawks, (squawks) => {
    const clone = Array.from(squawks).sort((a, b) => b.date - a.date);
    return timesUpdate(clone);
  });
  const squawks = useStoreSelector(sortedSquawks);

  const [state, setState] = useState<{ newSquawk: boolean }>({
    //use to control the "new squawks" alert if the phone is in foreground or background
    newSquawk: false,
  });

  //helps us keeps snapshot of the scroll position
  const scroller = useRef<FlatList<Squawk> | null>(null);

  //reference to the scroll position of the flatlist
  const scrollPosition = useRef<number | undefined>(undefined);

  const handleReceiveSquawks = useCallback(
    (squawks: Squawk[]) => {
      dispatch(
        receiveSquawks({
          squawks,
        })
      );

      lastTimeUpdate.current = Date.now();
    },
    [squawks]
  );

  const softTimesUpdate = useCallback(() => {
    if (Date.now() - lastTimeUpdate.current < 1000 * 10) return;
    handleReceiveSquawks(timesUpdate(squawks));
  }, [timesUpdate, squawks]);

  const { newSquawk } = state;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        /**
         * We want to only load messages from the instructor the user is following.
         * Anytime this screen is on focus, we want to reload the DB
         *
         * NOTE: This could not be expensive because it is local SQLite DB, but if we had
         * this squawker messages in a remote DB, You will have to use Redux to help you re-render
         * this component by connecting to the store. You want to reduce quries to your remote DB as much as possible
         */
        const squawks = await db.getAllAsync<Squawk>(
          createSelectionFormAllSquawks()
        );
        handleReceiveSquawks(squawks);
      })();
    }, [])
  );

  useEffect(() => {
    updateIntervalId.current = setInterval(() => {
      softTimesUpdate();
    }, 1000 * 30);

    return () => {
      clearInterval(updateIntervalId.current);
      lastTimeUpdate.current = 0;
    };
  }, [softTimesUpdate]);

  //returns snapshot value
  //more here https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate
  const snapshot = useMemo(() => {
    if (scrollPosition.current) {
      //capture the scroll position so we can adjust scroll later
      return scrollPosition.current;
    }

    return undefined;
  }, [squawks.length]);

  //runs after component mounts
  useLayoutEffect(() => {
    if (snapshot) {
      scroller.current.scrollToOffset({
        offset:
          snapshot +
          squawk_list_item_height +
          squawk_list_item_separator_height,
        animated: false,
      });

      setState((currState) => ({
        ...currState,
        newSquawk: true,
      }));
    }
  }, [squawks.length]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      //get the scroll position
      scrollPosition.current = event.nativeEvent.contentOffset.y;

      //if the user is scrolling close to the top of the list, we remove the alert
      if (scrollPosition.current < 100 && newSquawk) {
        setState((currState) => ({
          ...currState,
          newSquawk: false,
        }));
      }
    },
    [newSquawk]
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push(screen_following)}>
              <MaterialCommunityIcons
                name="account-plus"
                size={24}
                color={white}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        {newSquawk && (
          <TouchableWithoutFeedback
            onPress={() => scroller.current.scrollToOffset({ offset: 0 })}
          >
            <View style={styles.squawks_alert}>
              <Text style={{ color: colorText }}>New Squawks</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        <FlatList<Squawk>
          ref={scroller}
          onScroll={handleScroll}
          data={squawks}
          extraData={squawks}
          getItemLayout={(_, index) => ({
            length: squawk_list_item_height + squawk_list_item_separator_height,
            offset:
              squawk_list_item_height +
              squawk_list_item_separator_height * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <SquawkerListItem
              key={index}
              author={item.author}
              authorKey={item.authorKey}
              message={item.message}
              date={item.date}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: squawk_list_item_separator_height,
                backgroundColor: colorDivider,
                marginLeft: 8,
                marginRight: 8,
              }}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>No squawker messages yet</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

console.log(new Date().getTime());

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  squawks_alert: {
    position: "absolute",
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 10,
      },
    }),
    width: 150,
    height: 30,
    top: 10,
    borderRadius: 30,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 350,
    alignSelf: "center",
  },
  emptyListContainer: {
    height: "100%",
    alignItems: "center",
  },
  emptyListText: {
    fontSize: 23,
    fontWeight: "700",
    marginTop: 70,
    textAlign: "center",
  },
});
