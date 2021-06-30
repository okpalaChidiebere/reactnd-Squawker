import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import MainComponent, { MainComponentOptions } from "./MainComponent"
import FollowingSquawker, { FollowingSquawkerOptions } from "./FollowingSquawker"
import { component_main, component_following } from "../utils/strings"

const Stack = createStackNavigator()
const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator headerMode="screen" initialRouteName={component_main}>
        <Stack.Screen
          name={component_main}
          component={MainComponent}
          options={MainComponentOptions}
        />
        <Stack.Screen
          name={component_following}
          component={FollowingSquawker}
          options={FollowingSquawkerOptions}
        />
    </Stack.Navigator>
  </NavigationContainer>
)

export default MainNavigator
