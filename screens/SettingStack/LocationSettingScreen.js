import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setUserData } from '../../redux/userSlice';
import styles from './styles';
import { ActivityIndicator } from 'react-native-paper';
import { PRIMARY_COLOR } from '../../assets/styles';
import { getLocations, getCoordinate } from '../../api/goong';
import Icon from '../../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button';

export default function LocationSettingScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [selection, setSelection] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const fetchResults = async () => {
    if (input != '') {
      setResults([]);
      setLoading(true);
      const locations = await getLocations(input);
      setResults(locations);
      setLoading(false);
    }
  };
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
        Hãy chọn vị trí của bạn
      </Text>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm"
          onChangeText={(text) => setInput(text)}
          returnKeyType="search"
          onSubmitEditing={fetchResults}
        />
        {loading && (
          <ActivityIndicator
            size="small"
            style={{
              width: 16,
              height: 16,
              alignSelf: 'center',
              marginTop: 16,
            }}
            color={PRIMARY_COLOR}
          />
        )}
        {results.map(
          (result, index) =>
            result && (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => setSelection(result)}
              >
                <View
                  style={
                    selection && selection.place_id == result.place_id
                      ? [styles.result, styles.selected]
                      : styles.result
                  }
                >
                  <Text style={styles.selectionText}>{result.description}</Text>
                </View>
              </TouchableWithoutFeedback>
            )
        )}
      </View>
      <View style={{ flex: 1 }}></View>
      {selection && (
        <Button
          style={{
            marginBottom: 20,
          }}
          onPress={async () => {
            const coordinate = await getCoordinate(selection.place_id);
            const data = {
              main: selection.structured_formatting.main_text,
              secondary: selection.structured_formatting.secondary_text,
              coordinate: coordinate,
            };
            console.log(data);
            dispatch(
              setUserData({
                ...userData,
                placeData: data,
              })
            );
            navigation.navigate('ImageUploadScreen');
          }}
          title="Tiếp theo"
        />
      )}
    </View>
  );
}
