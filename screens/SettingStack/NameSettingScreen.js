import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setUserData } from '../../redux/userSlice';
import styles from './styles';
import Button from '../../components/Button';
import isAlpha from 'validator/lib/isAlpha'

export default function LevelSettingScreen({ navigation }) {
  const [name, setName] = useState('');
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

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
    return isAlpha(name);
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: Math.max(insets.left, 16),
          paddingBottom: insets.bottom,
          backgroundColor: 'white',
        }}
      >
        <Text
          style={{
            marginTop: 16,
            fontSize: 34,
          }}
        >
          Tên của bạn là gì nhỉ?
        </Text>

        <View>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            autoCapitalize="words"
            onChangeText={(name) => setName(name)}
            value={name}
          />
        </View>

        <View style={{ flex: 1 }}></View>

        {name != '' && (
          <Button
            title="Tiếp theo"
            onPress={() => {
              dispatch(
                setUserData({
                  ...userData,
                  name: name,
                })
              );
              if (isValidateName(name)){
                navigation.navigate('DescriptionSetting');
              }
              else{
                alert('Tên không hợp lệ\n Tên không được chứa số và kí tự')
              }
            }}
            style={{
              marginBottom: 20,
            }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
