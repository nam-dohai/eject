import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FindStack from "./FindStack";
import MatchStack from "./MatchStack";
import ChatStack from "./ChatStack";
import ProfileStack from "./ProfileStack";
import TabBarIcon from "../components/TabBarIcon";
import { PRIMARY_COLOR, GRAY, DARK_GRAY } from "../assets/styles";
export default function RootTab() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: PRIMARY_COLOR,
        inactiveTintColor: DARK_GRAY,
        labelStyle: {
          fontSize: 13,
        },
        style: {
          paddingTop: 4,
          // borderTopWidth: 0,
          // marginBottom: 0,
          // shadowOpacity: 0.05,
          // shadowRadius: 10,
          // shadowColor: "black",
          // shadowOffset: { height: 0, width: 0 },
        },
      }}
    >
      <Tab.Screen
        name="FindStack"
        component={FindStack}
        options={{
          title: "Tìm kiếm",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="compass" />
          ),
        }}
      />
      <Tab.Screen
        name="MatchStack"
        component={MatchStack}
        options={{
          title: "Đã ghép đôi",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="heart" />
          ),
        }}
      />
      <Tab.Screen
        name="ChatStack"
        component={ChatStack}
        options={{
          title: "Tin nhắn",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="message" />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="account" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
