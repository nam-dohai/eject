import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { PRIMARY_COLOR, BLACK, DARK_GRAY, GRAY } from '../../assets/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setMatchData } from '../../redux/matchSlice';
import Button from '../../components/Button';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

export default function PaymentScreen({ route, navigation }) {
  const userData = useSelector((state) => state.user.data);
  const matchData = useSelector((state) => state.match.data);
  const dispatch = useDispatch();
  const matchRef = firestore().collection('matches');
  const { pack } = route.params;

  const confirmPayment = (pack) => {
    let detail;
    if (matchData.commitment.detail[0].id === userData.id) {
      const user = {
        ...matchData.commitment.detail[0],
        paid: true,
      };
      detail = [user, matchData.commitment.detail[1]];
    } else {
      const user = {
        ...matchData.commitment.detail[1],
        paid: true,
      };
      detail = [matchData.commitment.detail[0], user];
    }
    const commitment = {
      ...matchData.commitment,
      name: pack.name,
      price: pack.price,
      detail: detail,
    };
    matchRef
      .doc(matchData.id)
      .update({ commitment: commitment })
      .then(() => {
        navigation.navigate('MatieProfileScreen');
      });
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.image}></View>
        <View style={styles.detailContainer}>
          <Text style={styles.name}>{pack.name}</Text>
          <Text
            style={styles.price}
          >{`${pack.price.toLocaleString()} VND`}</Text>
        </View>
        <Text style={styles.overview}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis Lorem ipsum dolor sit amet,
          consectetur adipiscing elit ut aliquam, purus sit amet luctus
          venenatis elit ut aliquam, purus sit amet luctus venenatis
        </Text>
        <Text style={styles.paymentTitle}>Th??ng tin chuy???n kho???n</Text>
        <Text style={styles.paymentInfo}>
          {'Ng??n h??ng: '}
          <Text style={[styles.paymentInfo, styles.bold]}>
            Tien Phong Bank (TP)
          </Text>
        </Text>
        <Text style={styles.paymentInfo}>
          {'S??? t??i kho???n: '}
          <Text style={[styles.paymentInfo, styles.bold]}>03981811801</Text>
        </Text>
        <Text style={styles.paymentInfo}>
          {'Ch??? t??i kho???n: '}
          <Text style={[styles.paymentInfo, styles.bold]}>Cao Minh Ch??u</Text>
        </Text>
        <Text style={styles.paymentInfo}>
          {'S??? ti???n: '}
          <Text style={[styles.paymentInfo, styles.bold]}>{`${pack.price.toLocaleString()} VND`}</Text>
        </Text>
        <Text style={styles.paymentInfo}>
          Sau khi chuy???n kho???n, b???n vui l??ng b???m x??c nh???n ???? thanh to??n.
        </Text>
      </ScrollView>
      <Button
        title="X??c nh???n ???? thanh to??n"
        onPress={() => confirmPayment(pack)}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    height: 200,
    backgroundColor: GRAY,
    marginTop: 24,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
    color: BLACK,
  },
  price: {
    fontSize: 28,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  overview: {
    marginTop: 8,
    fontSize: 16,
    color: DARK_GRAY,
    textAlign: 'justify',
  },
  paymentTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: BLACK,
    marginTop: 32,
    marginBottom: 8,
  },
  paymentInfo: {
    fontSize: 16,
    color: DARK_GRAY,
  },
  bold: {
    fontWeight: '600',
  },
  button: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
});
