import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  TextInput,
  Keyboard,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../assets/styles';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';
import isAlpha from 'validator/lib/isAlpha';
import {userDataTemplate} from '../../constants'

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'


export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onFooterLinkPress = () => {
    navigation.navigate('LoginScreen');
  };

  const onSignupPress = async () => {
    if (!isValidate()){
      return
    }
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const userRef = firestore().collection('users');
        const data = {
          ...userDataTemplate,
          id: response.user.uid,
          name,
          firstLogin: true,
        };
        userRef
          .doc(uid)
          .set(data)
          .then(() => {
            setLoading(false);
            console.log('sign up success');
          })
          .catch((error) => {
            alert('Lỗi kết nối');
            setLoading(false);
          });
      })
      .catch((error) => {
        alert('Đăng ký: đã xảy ra lỗi khi đăng ký ', error);
        setLoading(false);
      });
  };

  const isValidateName = (name)=> {
    if (name==='') return false;
    name = name.toLowerCase();
    name = name.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    name = name.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    name = name.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    name = name.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    name = name.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    name = name.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    name = name.replace(/đ/g, "d");
    name = name.replace(/ /g,'');
    console.log(name);
    return isAlpha(name);
  }
  
  const isValidateEmail = (email)=>{
    return isEmail(email);
  }

  const isValidateStrongPassword = (password) => {
    return isStrongPassword(password,{minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 0, minUppercase:0});
  }

  const isValidate = () => {
    if (password != secondPassword){
      alert("Mật khẩu không khớp");
      return false;
    }
    if (!isValidateName(name)){
      alert("Tên không hợp lệ");
      return false;
    }
    if (!isValidateEmail(email)){
      alert("Email không hợp lệ");
      return false;
    }
    if (!isValidateStrongPassword(password)){
      alert("Mật khẩu cần chứa số và kí tự \nMật khẩu cần chứa tối thiểu 8 kí tự");
      return false;
    }
    return true;
  }
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        autoCapitalize='words'
        onChangeText={(name) => setName(name)}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize='none'
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        contextMenuHidden
        secureTextEntry
        autoCapitalize="none"
        autoCompleteType="password"
        placeholder="Mật khẩu"
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TextInput
        style={styles.input}
        contextMenuHidden
        secureTextEntry
        autoCapitalize="none"
        placeholder="Xác thực mật khẩu"
        onChangeText={(text) => setSecondPassword(text)}
        value={secondPassword}
      />
      <TouchableOpacity onPress={() => onSignupPress()} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator
            size="small"
            style={{ width: 16, height: 16 }}
            color="white"
          />
        ) : (
          <Text style={styles.buttonText}>Đăng ký</Text>
        )}
      </TouchableOpacity>
      <Text style={{ marginTop: 16, fontSize: 16 }}>
        {'Nếu bạn đã có tài khoản, hãy '}
        <Text onPress={onFooterLinkPress} style={styles.footerLink}>
          Đăng nhập
        </Text>
      </Text>
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
