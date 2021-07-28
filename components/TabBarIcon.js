import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PRIMARY_COLOR, GRAY, DARK_GRAY } from "../assets/styles";

export default function TabBarIcon({focused, name}) {
  return <MaterialCommunityIcons name={focused ? name : `${name}-outline`} size={20} color={ focused ? PRIMARY_COLOR : DARK_GRAY} />;
}
