import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { WHITE, GRAY, DARK_GRAY, BORDER, HEADING, SUB_HEADING, PARAGRAPH } from '../../assets/styles';
import Button from '../../components/Button';
import firebase from '../../firebase/config';
import { useSelector, useDispatch } from 'react-redux';
export default function PinCodeScreen({ route, navigation }) {
  const userData = useSelector((state) => state.user.data);
  const usersRef = firebase.firestore().collection('users');
  const { phoneNumber, verificationId } = route.params;
  const [verificationCode, setVerificationCode] = React.useState();
  const [logging, setLogging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const interval =
      timeLeft > 0 &&
      setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const formatTime = (time) => {
    let minutes = parseInt(time / 60, 10);
    let seconds = parseInt(time % 60, 10);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return `${minutes} : ${seconds}`;
  };
  const onLogIn = async () => {
    setLogging(true);
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .catch((error) => {
          setLogging(false);
          switch (error.code) {
            case 'auth/invalid-verification-code':
              alert('Mã xác thực chưa chính xác, bạn vui lòng kiểm tra lại mã xác thực');
              break;
            case 'auth/code-expired':
              alert('Mã xác thực đã hết hạn\nVui lòng thử lại');
              break;
          }
        //   alert('Có lỗi xảy ra');
          console.log(error);
          console.log(error.code);
        });
    } catch (error) {
      setLogging(false);
      switch (error.code) {
        case 'auth/invalid-verification-code':
          alert('Mã xác thực không chính xác');
          break;
        case 'auth/code-expired':
          alert('Mã xác thực đã hết hạn\nVui lòng thử lại');
          break;
      }
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Xác thực tài khoản</Text>
      <Text style={styles.h2}>{`Mã OTP đã được gửi đến số điện thoại của bạn`}</Text>
      <TextInput
        style={styles.input}
        placeholder={'Nhập mã OTP'}
        keyboardType="number-pad"
        textContentType="telephoneNumber"
        value={verificationCode}
        onChangeText={(text) => setVerificationCode(text)}
      /> 
      <Button loading={logging} disabled={logging} title={'Xác nhận'} onPress={() => onLogIn()} />
      {/* <Text style={{ color: timeLeft === 0 ? 'red' : 'green' }}>
        {formatTime(timeLeft)}
      </Text>
      <Button
        disabled={timeLeft > 0}
        title={'Re-send'}
        onPress={() => setTimeLeft(120)}
      >
        Re-send
      </Button> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'center',
    paddingHorizontal: 20,
  },
  h1: {
    ...HEADING,
    marginTop: 24,
  },
  h2: {
    marginTop: 8,
    ...SUB_HEADING,
  },
  otp: {
    height: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingLeft: 16,
    marginTop: 32,
    borderRadius: 10,
    ...PARAGRAPH,
    marginBottom: 16,
  },
});
