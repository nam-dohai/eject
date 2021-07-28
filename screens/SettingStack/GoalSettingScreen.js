import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setUserData } from '../../redux/userSlice';
import styles from './styles';
import Icon from '../../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button';

const selections = [
  'Bắt đầu và duy trì học tiếng Anh',
  'Thi IETLS',
  'Thi TOEIC',
  'Ôn thi THPT',
];

export default function GoalSettingScreen({ navigation }) {
  const [selection, setSelection] = useState(null);
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: Math.max(insets.left, 16),
        paddingBottom: insets.bottom,
        // justifyContent: 'space-between',
        backgroundColor: 'white',
      }}
    >
      <Text
        style={{
          marginTop: 16,
          fontSize: 34,
        }}
      >
        Mục tiêu của bạn là
      </Text>
      <View>
        {selections.map((name, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => setSelection(name)}
          >
            <View
              style={
                selection == name ? styles.selectionChecked : styles.selection
              }
            >
              <Text style={styles.selectionText}>{name}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
      <View style={{ flex: 1 }}></View>
      {selection && (
        <Button
          style={{
            marginBottom: 20,
          }}
          onPress={() => {
            dispatch(
              setUserData({
                ...userData,
                goal: selection,
              })
            );
            navigation.navigate('LocationSetting');
          }}
          title="Tiếp theo"
        />
      )}
    </View>
  );
}
