import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../../redux/userSlice';
import Icon from '../../components/Icon';
import { WHITE, GRAY, DARK_GRAY, BLACK, HEADING, SUB_HEADING, PARAGRAPH } from '../../assets/styles';
import Button from '../../components/Button';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

export default function ProfileScreen({ navigation }) {
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const signOut = () => {
    firestore()
      .collection('users')
      .doc(userData.id)
      .get()
      .then((doc) => {
        const newTokenList = doc
          .data()
          .tokenList.filter((token) => token != userData.token);
        firestore()
          .collection('users')
          .doc(userData.id)
          .update({ tokenList: newTokenList })
          .then(() => {
            auth()
              .signOut()
              .catch((error) => alert(error));
          });
      });
  };
  const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'white',
  },
  avatar: {
    height: 400,
    width: '100%',
  },
  name: {
    ...HEADING,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  });
  const ListItem = ({icon, title}) => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        marginTop: 8,
        marginLeft: 8
      }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 100,
          marginRight: 12
        }}>
          {icon}
        </View>
        <Text style={{
          fontSize: 17,
          color: DARK_GRAY,
          flex: 1
        }}>{title}</Text>
      </View>
    )
  }
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Image
          source={{
            uri: userData.image,
          }}
          style={styles.avatar}
        ></Image>
        <View style={{
          marginHorizontal: 20,
          marginTop: -100,
          marginBottom: 50,
          paddingHorizontal: 20,
          paddingVertical: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          elevation: 1,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowColor: BLACK,
          shadowOffset: { height: 16, width: 0 },
        }}>
          <Text style={styles.name}>{userData.name}</Text>
          <Button mode='outline' compact title="Đăng xuất" style={styles.button} onPress={signOut} />
          <ListItem icon={<Icon name='account' size={16} />} title={userData.level} />
          <ListItem icon={<Icon name='target' size={16} />} title={userData.goal} />
          <ListItem icon={<Icon name='map-marker' size={16} />} title={userData.placeData.main + ', ' + userData.placeData.secondary} />
          <ListItem icon={<Icon name='comment-text' size={16} />} title={userData.description} />
        </View>

      </View>
    </ScrollView>
  );
}
