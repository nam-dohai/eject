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
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../assets/styles';
import Icon from '../../components/Icon';

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

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
        const credential = auth.FacebookAuthProvider.credential(token);
        auth()
          .signInWithCredential(credential)
          .then((response) => {
            const uid = response.user.uid;
            const userRef = firestore().collection('users');
            userRef
              .doc(uid)
              .get()
              .then((doc) => {
                if (!doc.exists()) {
                  alert('Ng?????i d??ng n??y kh??ng t???n t???i');
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
                      '????ng nh???p b???ng Facebook: ???? x???y ra l???i khi t???o d??? li???u tr??n Database ',
                      error
                    );
                  });
              });
          })
          .catch((error) => {
            alert(
              '????ng nh???p b???ng Facebook: ???? x???y ra l???i khi ????ng nh???p ',
              error
            );
          });
      }
    } catch (error) {
      alert(
        '????ng nh???p b???ng Facebook(Expo): ???? x???y ra l???i khi ????ng nh???p ',
        error
      );
    }
  };

  const onLoginPress = async () => {
    setLogging(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const userRef = firestore().collection('users');
        userRef
          .doc(uid)
          .get()
          .then((doc) => {
            setLogging(false);
            if (!doc.exists) {
              alert('Ng?????i d??ng n??y kh??ng t???n t???i');
              return;
            }
          })
          .catch((error) => {
            setLogging(false);
            alert('L???i k???t n???i');
          });
      })
      .catch((error) => {
        setLogging(false);
        console.log(error.code)
        switch(error.code){
          case 'auth/invalid-email':
            alert('Email kh??ng h???p l???');
            break;
          case 'auth/user-not-found':
            alert('Ng?????i d??ng n??y ch??a ???????c ????ng k??');
            break;          
          case 'auth/wrong-password':
            alert('Sai m???t kh???u');
            break;
          default:
            if (error.code === 'auth/too-many-requests'){              
              alert('????ng nh???p sai qu?? nhi???u');
            }
            else{
              alert('L???i x???y ra khi ????ng nh???p');
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
          placeholder="M???t kh???u"
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <TouchableOpacity onPress={() => onLoginPress()} style={styles.button} disabled={logging}>
          {logging ? (
            <ActivityIndicator size="small" style={{width: 16, height: 16}} color='white' />
          ) : (
            <Text style={styles.buttonText}>????ng nh???p</Text>
          )}
        </TouchableOpacity>
        <Text style={{ marginTop: 16, fontSize: 16 }}>
          {'N???u b???n ch??a c?? t??i kho???n, h??y '}
          <Text onPress={onFooterLinkPress} style={styles.footerLink}>
            ????ng k??
          </Text>
        </Text>
        <Divider title="Ho???c" />
        <TouchableOpacity
          onPress={() => onLoginFacebookPress()}
          style={styles.buttonOutline}
          disabled={logging}
        >
          <Icon name="facebook" size={16} color="#006AFF" />
          <Text style={styles.buttonOutlineText}>????ng nh???p b???ng Facebook</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Nh???p s??? ??i???n tho???i"
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
