import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { getDistance } from '../api/goong';
import { HEADING, SUB_HEADING } from '../assets/styles';
import { LinearGradient } from 'expo-linear-gradient';

const cardItemHeight = Dimensions.get('window').height - 150;
const fullWidth = Dimensions.get('window').width;

const FindMatieCardItem = ({
  matie
}) => {
  const {
    name,
    image,
    level,
    goal,
    placeData,
    description
  } = matie;
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} onLoad={()=>setImageLoaded(true)} />

      {imageLoaded&&(
      <LinearGradient
        colors={[ 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}
        start={[0, 1]}
        end={[0, 0]}
        style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.detailText}>{`Trình độ: ${level}`}</Text>
        <Text style={styles.detailText}>{`Mục tiêu: ${goal}`}</Text>
        <Text style={styles.detailText}>{`${description}`}</Text>
        <Text style={styles.detailText}>{`Đến từ: ${placeData.main}, ${placeData.secondary}`}</Text>
      </LinearGradient>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    elevation: 1,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    backgroundColor: 'white',
    borderRadius: 10,
    // overflow: 'hidden',
  },
  image: {
    borderRadius: 10,
    flex: 1,
  },
  info: {
    position: 'absolute',
    borderRadius: 10,
    bottom: 0,
    left: 0,
    // borderColor: 'red',
    // borderWidth: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 16,
    // alignItems: 'center',
  },
  name: {
    ...HEADING,
    color: 'white',
    marginTop: 64,
    marginBottom: 8,
  },
  detailText: {
    ...SUB_HEADING,
    color: 'white',
    // marginHorizontal: 8,
    // textAlign: 'center',
  },
});
export default FindMatieCardItem;
