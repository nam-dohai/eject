import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setUserData } from '../../redux/userSlice';
import styles from './styles';
import Icon from '../../components/Icon';
import Button from '../../components/Button';

const selections = ['Mới bắt đầu', 'Trung bình', 'Thành thạo', 'Nâng cao'];

export default function LevelSettingScreen({ navigation }) {
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
        Bạn tự đánh giá trình độ của bản thân ở mức nào nhỉ?
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
          title="Tiếp theo"
          onPress={() => {
            dispatch(
              setUserData({
                ...userData,
                level: selection,
              })
            );
            navigation.navigate('GoalSetting');
          }}
          style={{
            marginBottom: 20,
          }}
        />
      )}
    </View>
  );
}
