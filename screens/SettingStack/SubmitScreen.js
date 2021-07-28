import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../../components/Icon';
import successfullIcon from '../../assets/successfull-icon.png';
import { updateUserData } from '../../redux/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import firebase from '../../firebase/config';
import Button from '../../components/Button';

export default function SubmitScreen() {
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Image source={successfullIcon} style={styles.image} />
      <Text style={styles.title}>Tuyệt vời</Text>
      <Text style={styles.body}>Bạn đã hoàn tất nhập thông tin</Text>
      <Button
        style={{
          marginTop: 32,
          width: '100%',
        }}
        title="Tìm Matie"
        onPress={() => {
          const usersRef = firebase.firestore().collection('users');
          usersRef
            .doc(userData.id)
            .update({
              ...userData,
              firstLogin: false,
            })
            .then(() => {
              dispatch(
                updateUserData({
                  firstLogin: false,
                })
              );
            });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '500',
    marginTop: 16,
    color: '#0F2137',
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    marginTop: 4,
    color: '#343D48',
  },
  buttonContainer: {
    marginTop: 32,
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginRight: 8,
  },
});
