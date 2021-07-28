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
  const [description, setDescription] = useState('');
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

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
          Bạn tự nhận xét mình là người như thế nào nhỉ?
        </Text>

        <View>
          <TextInput
            style={styles.input}
            placeholder="Nhận xét về bản thân"
            multiline
            numberOfLines={6}
            onChangeText={(description) => setDescription(description)}
            value={description}
          />
        </View>

        <View style={{ flex: 1 }}></View>

        {description != '' && (
          <Button
            title="Tiếp theo"
            onPress={() => {
              dispatch(
                setUserData({
                  ...userData,
                  description: description,
                })
              );
              navigation.navigate('LevelSetting');
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
