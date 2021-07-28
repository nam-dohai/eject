import React from 'react';
import { Text, View, Image, Dimensions, StyleSheet } from 'react-native';
import { BLACK, WHITE, HEADING } from '../assets/styles';

const CardItem = ({ image, name }) => {
  const fullWidth = Dimensions.get('window').width;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: WHITE,
      borderRadius: 8,
      alignItems: 'center',
      margin: 10,
      elevation: 1,
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowColor: BLACK,
      shadowOffset: { height: 16, width: 0 },
    },
    image: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      width: fullWidth / 2 - 30,
      height: fullWidth / 2 - 30,
      margin: 0,
    },
    name: {
      ...HEADING,
      marginVertical: 16,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />

      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

export default CardItem;
