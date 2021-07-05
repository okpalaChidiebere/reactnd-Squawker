import React, { useEffect, useRef, useMemo, useLayoutEffect, useState } from "react"
import { View, StyleSheet, TouchableOpacity, FlatList, Text, TouchableWithoutFeedback, Platform }  from "react-native"
import { useIsFocused } from "@react-navigation/native"
import { connect } from "react-redux"
import SquawkerListItem from "./SquawkerListItem"
import { colorPrimary, app_name, component_following, white, colorDivider, colorText } from "../utils/strings"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import db, { listAllSquawks } from "../utils/DatabaseProvider"
import { receiveSquawks } from "../actions"
import { squawk_list_item_height, squawk_list_item_separator_height } from "../utils/dimens"


function MainComponent({ squawks, dispatch }) {

  const isFocused = useIsFocused()

  //helps us keeps snapshot of the scroll position
  const scroller = useRef(null)

  //reference to the scroll position of the flatlist
  const scrollPosition = useRef(null)

  //use to control the "new squawks" alert if the phone is in forrground or background
  const [newSquawk, setNewSquawk] = useState(false)

  useEffect(() => {
    (async () => {
      const squawtMessages = await listAllSquawks(db)
      dispatch(receiveSquawks(squawtMessages))
    })()

    /**
     * We want to only load messages from the instructor the user is following. 
     * Anytime this screen is on focus, we want to reload the DB
     * 
     * NOTE: This could not be expensive because it is local SQLite DB, but if we had 
     * this squawker messages in a remote DB, You will have to use Redux to help you re-render 
     * this component by connecting to the store. You want to reduce quries to your remote DB as much as possible
     */
  }, [ isFocused ])

  //returns snapshot value
  //more here https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate
  const snapshot = useMemo(() => {
        
    if (scrollPosition.current) {
        //capture the scroll position so we can adjust scroll later
        return scrollPosition.current
    }

    return undefined
  }, [ squawks ])

  //runs after component mounts
  useLayoutEffect(() => {
    if (snapshot) {
      //console.log("SnapshotValue: ",snapshot)
        scroller.current.scrollToOffset({
            offset: snapshot + squawk_list_item_height + squawk_list_item_separator_height,
            animated: false,
        });
        setNewSquawk(true)
    }
  }, [ squawks ])

  const handleScroll=(event)=>{
    //get the scroll position
    scrollPosition.current = event.nativeEvent.contentOffset.y

    //if the user is crolling close to the top of the list, we remove the alert
    if (scrollPosition.current < 100) {
      setNewSquawk(false)
    }
  }

    return ( 
    <View style={styles.container}>
      {newSquawk && (
        <TouchableWithoutFeedback 
        onPress={() => scroller.current.scrollToOffset({offset:0})}
        >
          <View style={styles.squawks_alert}>
            <Text style={{color: colorText}}>New Squawks</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
      <FlatList
        ref={scroller} 
        onScroll={(event)=>handleScroll(event)}
        data={squawks} 
        getItemLayout={(_, index) => ({
          length: squawk_list_item_height + squawk_list_item_separator_height, 
          offset: squawk_list_item_height + squawk_list_item_separator_height * index,
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
        keyExtractor={( _ , index )=> index.toString()}
        ItemSeparatorComponent={ () => <View style={{height:squawk_list_item_separator_height, backgroundColor:colorDivider, marginLeft:8, marginRight:8}}/> }
      />
    </View>
    )
}

const mapStateToProps = ( squawks ) => { 
  return {
    squawks 
  }
}

const connectedMainComponent = connect(mapStateToProps)
export default connectedMainComponent(MainComponent)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    squawks_alert: {
     position:"absolute",
      backgroundColor:'#fff',
      //https://stackoverflow.com/questions/41320131/how-to-set-shadows-in-react-native-for-android
      ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
        },
        android: {
          elevation: 10
        },
      }),
      width: 150,
      height:30,
      top: 20,
      borderRadius: 30,
      zIndex: 1,
      justifyContent:"center",
      alignItems:"center",
      marginHorizontal:350,
      left: 0, right: 0, 
    }
  })

export function MainComponentOptions({ route, navigation }) {

    return {
        title: app_name,
        headerTintColor: '#fff',
        headerStyle: { 
            backgroundColor: colorPrimary,
        },
        headerRight: () => ( 
          <TouchableOpacity onPress={() => navigation.navigate(component_following)}>
            <View style={{paddingRight: 20}}>
              <MaterialCommunityIcons name="account-plus" size={24} color={white} />
            </View>
          </TouchableOpacity>
        )
    }
}

/**
 
 */