import React, { useState, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity, FlatList }  from "react-native"
import { useIsFocused } from "@react-navigation/native"
import SquawkerListItem from "./SquawkerListItem"
import { colorPrimary, app_name, component_following, white, colorDivider } from "../utils/strings"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import db, { listAllSquawks } from "../utils/DatabaseProvider"


export default function MainComponent() {

  const isFocused = useIsFocused()

  const [messages, setMessages] = useState([])

  useEffect(() => {
    (async () => {
      const squawtMessages = await listAllSquawks(db)
      setMessages(squawtMessages)
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

    return ( 
    <View style={styles.container}>
      <FlatList 
        data={messages} 
        renderItem={({ item }) => (
          <SquawkerListItem 
            key={item._id}
            author={item.author}
            authorKey={item.authorKey}
            message={item.message}
            date={item.date}
          />
      )} 
        keyExtractor={( _ , index )=> index.toString()}
        ItemSeparatorComponent={ () => <View style={{height:1, backgroundColor:colorDivider, marginLeft:8, marginRight:8}}/> }
      />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
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