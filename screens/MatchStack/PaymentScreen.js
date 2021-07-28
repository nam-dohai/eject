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
import firebase from '../../firebase/config';
import Button from '../../components/Button';

export default function PaymentScreen({ route, navigation }) {
  const userData = useSelector((state) => state.user.data);
  const matchData = useSelector((state) => state.match.data);
  const dispatch = useDispatch();
  const matchRef = firebase.firestore().collection('matches');
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
        <Text style={styles.paymentTitle}>Thông tin chuyển khoản</Text>
        <Text style={styles.paymentInfo}>
          {'Ngân hàng: '}
          <Text style={[styles.paymentInfo, styles.bold]}>
            Tien Phong Bank (TP)
          </Text>
        </Text>
        <Text style={styles.paymentInfo}>
          {'Số tài khoản: '}
          <Text style={[styles.paymentInfo, styles.bold]}>03981811801</Text>
        </Text>
        <Text style={styles.paymentInfo}>
          {'Chủ tài khoản: '}
          <Text style={[styles.paymentInfo, styles.bold]}>Cao Minh Châu</Text>
        </Text>
        <Text style={styles.paymentInfo}>
          {'Số tiền: '}
          <Text style={[styles.paymentInfo, styles.bold]}>{`${pack.price.toLocaleString()} VND`}</Text>
        </Text>
        <Text style={styles.paymentInfo}>
          Sau khi chuyển khoản, bạn vui lòng bấm xác nhận đã thanh toán.
        </Text>
      </ScrollView>
      <Button
        title="Xác nhận đã thanh toán"
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
