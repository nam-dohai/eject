import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  Platform,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../../redux/userSlice';
import styles from './styles';
import { ActivityIndicator } from 'react-native-paper';
import { PRIMARY_COLOR } from '../../assets/styles';
import Icon from '../../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button';
import storage from '@react-native-firebase/storage';

export default function ImageUploadScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [uploadingData, setUploadingData] = useState(false);
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    setImage(null);
    setLoadingImage(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.3,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setLoadingImage(false);
    } else {
      setLoadingImage(false);
    }
  };

  const submit = async () => {
    setUploadingData(true);
    const downloadURL = await uploadImageAsync(image);
    dispatch(
      setUserData({
        ...userData,
        image: downloadURL,
      })
    );
    setUploadingData(false);
    navigation.navigate('SubmitScreen');
  };

  const uploadImageAsync = async (uri) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        // console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const ref = storage().ref(`images/${userData.id}.jpeg`);
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();
    const downloadURL = await ref.getDownloadURL();
    
    return downloadURL;
  };
  return (
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
        Tải lên ảnh của bạn nhé
      </Text>
      <TouchableWithoutFeedback onPress={pickImage}>
        <View style={styles.selection}>
          <Text style={styles.selectionText}>Chọn ảnh</Text>
        </View>
      </TouchableWithoutFeedback>
      {loadingImage && (
        <ActivityIndicator
          size="small"
          style={{ width: 16, height: 16, alignSelf: 'center', marginTop: 16 }}
          color={PRIMARY_COLOR}
        />
      )}
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: '100%',
            flex: 1,
            alignSelf: 'center',
            marginVertical: 24,
            borderRadius: 10,
          }}
        />
      )}
      {image && (
        <Button
          style={{
            marginBottom: 20,
          }}
          onPress={submit}
          disabled={uploadingData}
          loading={uploadingData}
          title="Tiếp theo"
        />
      )}
    </View>
  );
}
