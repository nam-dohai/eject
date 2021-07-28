import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Button from '../../components/Button';
import { BORDER, HEADING, SUB_HEADING, PARAGRAPH } from '../../assets/styles';
import firebaseConfig from '../../firebase/firebaseConfig'
import firebase from '../../firebase/config'
import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha'
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../../redux/userSlice'
import {userDataTemplate} from '../../constants/index'
import vietnam from '../../assets/image/vietnam.png';
export default function PhoneLoginScreen({route, navigation}) {
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
    const recaptchaVerifier = React.useRef(null);
    const [phoneNumber, setPhoneNumber] = React.useState();
    const [loading, setLoading] = useState(false);
    const onSubmitPhoneNumber = async () => {
      setLoading(true);
      try{
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(`+84${phoneNumber}`, recaptchaVerifier.current);
        dispatch(setUserData({          
            ...userDataTemplate,
            phoneNumber: phoneNumber,
        }));
        await navigation.navigate('PinCodeScreen',{
            phoneNumber: phoneNumber,
            verificationId: verificationId,
        });
        console.log(recaptchaVerifier.current);
      }
      catch(error){
        setLoading(false);
        console.log(error)
        switch(error.code){
          case 'auth/too-many-requests':
            alert('Đăng nhập quá nhiều\nVui lòng quay lại sau');
            break;
          case 'auth/invalid-phone-number':
            alert('Số điện thoại này không tồn tại');
            break;
          case 'auth/quota-exceeded':
            alert('Quá tải số lượng truy cập\nVui lòng quay lại sau');
            break;
          default:
            alert('Có lỗi xảy ra');
        }
      }
    }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
            attemptInvisibleVerification={true}
        />
        <Text style={styles.h1}>Lấy mã OTP</Text>
        <Text style={styles.h2}>
          BeeMatie sẽ gửi cho bạn một mã gồm 6 chữ số về điện thoại của bạn
        </Text>
        <Text style={styles.h3}>Số điện thoại của bạn</Text>
        <View style={styles.phoneContainer}>
          <View style={styles.codeContainer}>
            <Image
              source={vietnam}
              style={styles.countryIcon}
            />
            <Text style={styles.countryCode}>+84</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={'Nhập số điện thoại'}
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            value={phoneNumber}
            onChangeText={(text)=>setPhoneNumber(text)}
          />
        </View>
        <Button
          loading={loading}
          title={'Lấy mã OTP'}
          onPress={()=>onSubmitPhoneNumber()}
          style={{ marginTop: 16 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  h3: {
    marginTop: 32,
    ...SUB_HEADING,
  },
  phoneContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: BORDER,
    borderWidth: 1,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  codeContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    borderRightWidth: 1,
    borderRightColor: BORDER,
    paddingHorizontal: 8,
  },
  countryIcon: {
    width: 24,
    height: 16,
    borderRadius: 3,
  },
  countryCode: {
    ...PARAGRAPH,
    marginLeft: 8,
  },
  input: {
    flex: 1,
    ...PARAGRAPH,
    paddingVertical: 16,
    paddingLeft: 8,
  },
});
