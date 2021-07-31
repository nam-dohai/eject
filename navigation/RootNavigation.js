import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootTab from './RootTab';
import LoginStack from './LoginStack';
import SettingStack from './SettingStack';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import {userDataTemplate} from '../constants/index'
import * as Linking from 'expo-linking'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

export default function RootNavigation() {
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const [isAuth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const usersRef = firestore().collection('users');

  useEffect(() => {
    const logIn = () => {
      auth().onAuthStateChanged((response) => {
        console.log(response);
        if (response) {
          registerForPushNotificationsAsync().then((token) => {     
            usersRef
              .doc(response.uid)
              .get()
              .then((document) => {
                if (document.exists){
                  const data = document.data();
                  const newTokenList  = data.tokenList ? [...data.tokenList] : [];
                  if (data.tokenList) {
                    if (!data.tokenList.includes(token)) {
                      newTokenList.push(token);
                    }
                  }
                  usersRef
                  .doc(response.uid)
                  .update({ tokenList: newTokenList })
                  .then(() => {
                    dispatch(
                      setUserData({
                        ...userDataTemplate,
                        ...userData,
                        ...data,
                        id: response.uid,
                        tokenList: newTokenList,
                        token: token,
                      })
                      );
                      setAuth(true);
                      setLoading(false);
                    });
                }
                else{
                  const data = {
                    ...userData,
                    token: token,
                    phoneNumber: response.phoneNumber,
                    creationTime: (new Date()).getTime(),
                    id: response.uid,
                    firstLogin:true,
                    tokenList: [token]
                  }
                  usersRef.doc(response.uid).set(data)
                    .then(()=>{
                        dispatch(setUserData({
                          ...data,
                          token: token
                        }))  
                        console.log(data.tokenList)                      
                        setAuth(true);
                        setLoading(false);
                    })
                    .catch(error=>{
                        alert('Lỗi kết nối');
                    });  
                }
              });
          });
        } else {
          setAuth(false);
          setLoading(false);
        }
      });
    }
  logIn();
  }, []);

  return (
    <>
      {loading ? (
        <SafeAreaView style={styles.container}>
          <Text>Loading</Text>
        </SafeAreaView>
      ) : (
        <NavigationContainer
          linking={{
            prefixes:[Linking.createURL('/')],
            config:{
              screens:{
                MatchStack:{
                  initialRouteName: 'MatieScreen',
                  screens:{
                    MatieScreen: 'matie',
                    MatieProfileScreen: 'matieProfile/:matieId/:matchId',
                  }
                },
                ChatStack:{
                  screens:{
                    ChatListScreen: 'chatList',
                  }
                }
              }
            },
            subscribe(listener){
              const onReceiveURL = ({ url }) => listener(url);

              Linking.addEventListener('url', onReceiveURL);

              const subscription = Notifications.addNotificationResponseReceivedListener(response => {
                const url = response.notification.request.content.data.url;
                console.log(url)
                listener(url);
              });

              return () => {
                Linking.removeEventListener('url', onReceiveURL);
                subscription.remove();
              };
            }
          }}
        >
          {isAuth ? (
            userData.firstLogin ? (
              <SettingStack />
            ) : (
              <RootTab />
            )
          ) : (
            <LoginStack />
          )}
        </NavigationContainer>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

async function registerForPushNotificationsAsync() {
  // let token;
  // if (Constants.isDevice) {
  //   const { status: existingStatus } =
  //     await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;
  //   if (existingStatus !== 'granted') {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }
  //   if (finalStatus !== 'granted') {
  //     alert('Failed to get push token for push notification!');
  //     return;
  //   }
  //   token = (await Notifications.getExpoPushTokenAsync()).data;
  // } else {
  //   alert('Must use physical device for Push Notifications');
  // }

  // if (Platform.OS === 'android') {
  //   Notifications.setNotificationChannelAsync('default', {
  //     name: 'default',
  //     importance: Notifications.AndroidImportance.MAX,
  //     vibrationPattern: [0, 250, 250, 250],
  //     lightColor: '#FF231F7C',
  //   });
  // }

  return 'token';
}
