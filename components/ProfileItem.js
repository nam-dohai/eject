import React from "react";
import { Text, View } from "react-native";
import Icon from "./Icon";
import styles, { DARK_GRAY, WHITE } from "../assets/styles";

const ProfileItem = ({
  age,
  level,
  goal,
  distance,
  commit,
  location,
  matches,
  name,
}) => (
  <View style={styles.containerProfileItem}>
    <View style={styles.matchesProfileItem}>
      <Text style={styles.matchesTextProfileItem}>
        <Icon name="heart" size={13} color={WHITE} /> {matches}% Match!
      </Text>
    </View>

    <Text style={styles.name}>{name}</Text>

    <Text style={styles.descriptionProfileItem}>
      {age} - {location}
    </Text>

    {level&&(
    <View style={styles.info}>
      <Text style={styles.iconProfile}>
        <Icon name="account" size={14} color={DARK_GRAY} />
      </Text>
      <Text style={styles.infoContent}>{level}</Text>
    </View>
    )}

    {goal&&(
    <View style={styles.info}>
      <Text style={styles.iconProfile}>
        <Icon name="target" size={14} color={DARK_GRAY} />
      </Text>
      <Text style={styles.infoContent}>{goal}</Text>
    </View>
    )}

    {distance&&(
    <View style={styles.info}>
      <Text style={styles.iconProfile}>
        <Icon name="map-marker-distance" size={14} color={DARK_GRAY} />
      </Text>
      <Text style={styles.infoContent}>{distance}</Text>
    </View>
    )}

    {commit&&(
    <View style={styles.info}>
      <Text style={styles.iconProfile}>
        <Icon name="file-document-edit-outline" size={14} color={DARK_GRAY} />
      </Text>
      <Text style={styles.infoContent}>{commit}</Text>
    </View>
    )}
  </View>
);

export default ProfileItem;
