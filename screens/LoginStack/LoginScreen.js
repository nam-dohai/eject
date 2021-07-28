import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import firebase from '../../firebase/config';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../assets/styles';
import Icon from '../../components/Icon';

const Divider = ({ title }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
    }}
  >
    <View
      style={{
        flex: 1,
        borderBottomColor: '#C2C8D0',
        borderBottomWidth: 1,
      }}
    ></View>
    <Text
      style={{
        marginHorizontal: 8,
        fontSize: 16,
      }}
    >
      {title}
    </Text>
    <View
      style={{
        flex: 1,
        borderBottomColor: '#C2C8D0',
        borderBottomWidth: 1,
      }}
    ></View>
  </View>
);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logging, setLogging] = useState(false);
  const [phoneNumber,setPhoneNumber] = useState('');

  const onFooterLinkPress = () => {
    navigation.navigate('PhoneNumberSignUpScreen');
  };
  const onLoginFacebookPress = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '902167530641914',
      });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((response) => {
            const uid = response.user.uid;
            const userRef = firebase.firestore().collection('users');
            userRef
              .doc(uid)
              .get()
              .then((doc) => {
                if (!doc.exists()) {
                  alert('Người dùng này không tồn tại');
                  return;
                }
              })
              .catch((error) => {
                const data = {
                  name: response.user.displayName,
                  firstLogin: true,
                };
                userRef
                  .doc(uid)
                  .set(data)
                  .then(() => console.log('facebook sign up success'))
                  .catch((error) => {
                    alert(
                      'Đăng nhập bằng Facebook: đã xảy ra lỗi khi tạo dữ liệu trên Database ',
                      error
                    );
                  });
              });
          })
          .catch((error) => {
            alert(
              'Đăng nhập bằng Facebook: đã xảy ra lỗi khi đăng nhập ',
              error
            );
          });
      }
    } catch (error) {
      alert(
        'Đăng nhập bằng Facebook(Expo): đã xảy ra lỗi khi đăng nhập ',
        error
      );
    }
  };

  const onLoginPress = async () => {
    setLogging(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const userRef = firebase.firestore().collection('users');
        userRef
          .doc(uid)
          .get()
          .then((doc) => {
            setLogging(false);
            if (!doc.exists) {
              alert('Người dùng này không tồn tại');
              return;
            }
          })
          .catch((error) => {
            setLogging(false);
            alert('Lỗi kết nối');
          });
      })
      .catch((error) => {
        setLogging(false);
        console.log(error.code)
        switch(error.code){
          case 'auth/invalid-email':
            alert('Email không hợp lệ');
            break;
          case 'auth/user-not-found':
            alert('Người dùng này chưa được đăng kí');
            break;          
          case 'auth/wrong-password':
            alert('Sai mật khẩu');
            break;
          default:
            if (error.code === 'auth/too-many-requests'){              
              alert('Đăng nhập sai quá nhiều');
            }
            else{
              alert('Lỗi xảy ra khi đăng nhập');
            }
        }
      });
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCapitalize='none'
          contextMenuHidden
          placeholder="Mật khẩu"
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <TouchableOpacity onPress={() => onLoginPress()} style={styles.button} disabled={logging}>
          {logging ? (
            <ActivityIndicator size="small" style={{width: 16, height: 16}} color='white' />
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>
        <Text style={{ marginTop: 16, fontSize: 16 }}>
          {'Nếu bạn chưa có tài khoản, hãy '}
          <Text onPress={onFooterLinkPress} style={styles.footerLink}>
            Đăng ký
          </Text>
        </Text>
        <Divider title="Hoặc" />
        <TouchableOpacity
          onPress={() => onLoginFacebookPress()}
          style={styles.buttonOutline}
          disabled={logging}
        >
          <Icon name="facebook" size={16} color="#006AFF" />
          <Text style={styles.buttonOutlineText}>Đăng nhập bằng Facebook</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          keyboardType='number-pad'
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C2C8D0',
    paddingVertical: 16,
    paddingLeft: 16,
    marginTop: 16,
    borderRadius: 4,
    fontSize: 16,
  },
  footerLink: {
    color: SECONDARY_COLOR,
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 24,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonOutline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C2C8D0',
    borderRadius: 4,
    paddingVertical: 16,
    marginTop: 24,
  },
  buttonOutlineText: {
    color: '#2D333A',
    fontSize: 16,
    marginLeft: 8,
    color: '#006AFF',
  },
});
