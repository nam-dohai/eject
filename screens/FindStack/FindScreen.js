import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Button, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { PRIMARY_COLOR, DARK_GRAY } from '../../assets/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData, updateUserData } from '../../redux/userSlice';
import FindMatieCardItem from '../../components/FindMatieCardItem';
import { matchDataTemplate } from '../../constants';
import Swiper from 'react-native-deck-swiper';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import matiesImage from '../../assets/maties.png';

import * as Notifications from 'expo-notifications';

import firestore from '@react-native-firebase/firestore'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function FindScreen({ navigation }) {
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const [maties, setMaties] = useState([]);
  const [matiesLoaded, setMatiesLoaded] = useState(false);
  const usersRef = firestore().collection('users');
  const matchesRef = firestore().collection('matches');
  const [creationTimeOfLastBrowsedMatie, setCreationTimeOfLastBrowsedMatie] = useState(userData.creationTimeOfLastBrowsedMatie);

  const insets = useSafeAreaInsets();
  const cardItemHeight = Dimensions.get('window').height - 49 - 64 - 40 - insets.top - insets.bottom;

  useEffect(() => {
    
    console.log(creationTimeOfLastBrowsedMatie);
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      fetchMaties();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  });

  const fetchMaties = () =>  {
    setMaties([]);
    setMatiesLoaded(false);
    if (creationTimeOfLastBrowsedMatie!=0) {
      usersRef
        .orderBy('creationTime')
        .startAfter(creationTimeOfLastBrowsedMatie)
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) => {
            const matie = doc.data();
            if (matie.id != userData.id && !matie.firstLogin) {
              setMaties((arr) => [...arr, matie]);
            }
          });
          setMatiesLoaded(true);
        })
        .catch((error) => {
          alert(`Firestore: ${error}`);
        });
    } else {
      usersRef
        .orderBy('creationTime')
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) => {
            const matie = doc.data();
            if (matie.id != userData.id && !matie.firstLogin) {
              setMaties((arr) => [...arr, matie]);
            }
          });
          setMatiesLoaded(true);
        })
        .catch((error) => {
          alert(`Firestore: ${error}`);
        });
    }
  };

  const onDislike = async (matie) => {
    if (!userData.dislikes.includes(matie.id)) {
      const newDislikes = [...userData.dislikes, matie.id];  
      
      usersRef
        .doc(userData.id)
        .update({
          dislikes: newDislikes,
          creationTimeOfLastBrowsedMatie: matie.creationTime,
        })
        .then((res) => {
          dispatch(
            updateUserData({
              dislikes: newDislikes,
            })
          );
        })
        .catch((error) => alert(error));
    }
  };

  const onLike = (matieData) => {
    if (!userData.likes.includes(matieData.id)) {
      const newLikes = [...userData.likes, matieData.id];
      usersRef
        .doc(userData.id)
        .update({
          likes: newLikes,          
          creationTimeOfLastBrowsedMatie: matieData.creationTime,
        })
        .then((res) => {
          dispatch(
            setUserData({
              ...userData,
              likes: newLikes,              
            })
          );
        })
        .catch((error) => alert(error));
      if (matieData.likes.includes(userData.id)) {
        createMatch(userData, matieData);
      }
    }
  };

  const createMatch = (userData, matieData) => {
    matchesRef
      .add(matchDataTemplate)
      .then((res) => {
        const match = {
          commitment: {
            detail: [
              {
                isConfirmed: false,
                paid: false,
                id: userData.id,
                name: userData.name,
              },
              {
                isConfirmed: false,
                paid: false,
                id: matieData.id,
                name: matieData.name,
              },
            ],
          },
          id: res.id,
        };
        matchesRef.doc(res.id).update(match);
        updateMatches(
          userData,
          matieData,
          {
            matieId: matieData.id,
            matchId: res.id,
          },
          true
        );
        updateMatches(
          matieData,
          userData,
          {
            matieId: userData.id,
            matchId: res.id,
          },
          false
        );
      })
      .catch((error) => alert(`Xảy ra lỗi: ${error}`));
  };

  const updateMatches = (userData, matieData, newMatch, isUser) => {
    const newMatches = [...userData.matches, newMatch];
    usersRef
      .doc(userData.id)
      .update({
        matches: newMatches,
      })
      .then(() => {
        if (isUser) {
          dispatch(
            updateUserData({
              matches: newMatches,
            })
          );
        }
        userData.tokenList.map((token) => {
          sendPushNotification(token, matieData.name, matieData.id,newMatch.matchId);
        });
      })
      .catch((error) => alert(error));
  };

  const renderCard = (matie, index) => {
    return (
      <FindMatieCardItem
        matie={matie}
      />
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    cardStyle: {
      marginTop: 20,
      height: cardItemHeight,
    },
  });

  return (
    <View style={styles.container}>
      {!matiesLoaded && (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator
            animating={true}
            color={PRIMARY_COLOR}
            size="large"
          />
        </View>
      )}
      {matiesLoaded && (
        <>
          {maties.length ? (
            <Swiper
              verticalSwipe={false}
              backgroundColor="#eeeeee"
              cardStyle={styles.cardStyle}
              dragEnd={() => Haptics.impactAsync()}
              onSwipedAll={() => {
                setMaties([]);
              }}
              onSwiped={(index,matie) => {
                setCreationTimeOfLastBrowsedMatie(matie.creationTime);
              }}
              onSwipedRight={(index, matie) => onLike(matie)}
              onSwipedLeft={(index, matie) => onDislike(matie)}
              cards={maties}
              cardVerticalMargin={0}
              renderCard={renderCard}
              stackSize={3}
              stackAnimationTension={50}
              disableBottomSwipe={true}
              disableTopSwipe={true}
            ></Swiper>
          ) : (
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image source={matiesImage} style={{
                height: 200,
                width: 200,
                resizeMode: 'contain'
              }} />
              <Text style={{textAlign: 'center', fontSize: 16, color: DARK_GRAY, paddingHorizontal: 52}}>Chưa có Matie mới, bạn vui lòng quay lại sau nhé!</Text>
              <Button
                title="Tải lại"
                onPress={fetchMaties}
              />
              {/* Buttons for debuging */}
              {/* <Button
                title="clear"
                onPress={async () => {
                  await AsyncStorage.removeItem('lastMatie');
                }}
              /> */}
            </View>
          )}
        </>
      )}
    </View>
  );
}

async function sendPushNotification(expoPushToken, matieName, matieId, matchId) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Tuyệt vời',
    body: `Chúc mừng bạn cùng ${matieName} đã match với nhau`,
    data: { url: `beetest://matieProfile/${matieId}/${matchId}`},
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
