import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMatchData } from '../../redux/matchSlice';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { PRIMARY_COLOR, BLACK, DARK_GRAY, GRAY } from '../../assets/styles';

const packs = [
  {
    name: 'Pack 1',
    price: 300000,
  },
  {
    name: 'Pack 2',
    price: 800000,
  },
  {
    name: 'Pack 3',
    price: 1300000,
  },
  {
    name: 'Pack 4',
    price: 1800000,
  },
];

export default function PaymentScreen({ navigation }) {
  const [selection, setSelection] = useState(null);
  const matchData = useSelector((state) => state.match.data);
  const dispatch = useDispatch();
  if (matchData.commitment.price) {
    packs.splice(0, packs.length); // clear packs
    packs.push({
      name: matchData.commitment.name,
      price: matchData.commitment.price,
    });
  }
  return (
      <ScrollView style={styles.scrollView}>
    <View style={styles.container}>
        {packs.map((pack, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelection(pack);
              navigation.navigate('PaymentScreen', {
                pack: pack,
              });
            }}
          >
            <View style={styles.listItemContainer}>
              <View style={styles.image}></View>
              <View style={styles.detail}>
                <Text style={styles.title}>{pack.name}</Text>
                <Text style={styles.price}>{`${pack.price.toLocaleString()} VND`}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
  },
  image: {
    backgroundColor: GRAY,
    height: 90,
    width: 90,
    borderRadius: 10,
  },
  detail: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_GRAY,
  },
  price: {
    fontSize: 28,
    marginTop: 4,
    color: PRIMARY_COLOR,
  }
});
