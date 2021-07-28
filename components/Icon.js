import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Icon = ({ color, name, size, style }) => (
  <MaterialCommunityIcons name={name} size={size} color={color} style={style} />
);

export default Icon;
