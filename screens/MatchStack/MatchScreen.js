import React from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { PRIMARY_COLOR, DARK_GRAY } from '../../assets/styles';
import { useSelector, useDispatch } from 'react-redux';
import CardItem from '../../components/CardItem';
import { useEffect, useState } from 'react';
import emptyMatie from '../../assets/empty-matie.png';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

export default function MatchScreen({ navigation }) {
  const userData = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const usersRef = firestore().collection('users');
  const [matieDatas, setMatieDatas] = useState([]);
  const [matieDatasLoaded, setMatieDatasLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMatie, setHasMatie] = useState(false);
  useEffect(() => {
    console.log(userData.creationTimeOfLastBrowsedMatie);
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      fetchMatieDatas();
      
    });
    return unsubscribe;
  });

  const fetchMatieDatas = () => {
    setMatieDatas([]);
    setRefreshing(true);
    setMatieDatasLoaded(false);
    usersRef
      .doc(userData.id)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data.matches.length) {
          data.matches.map((match, index) => {
            usersRef
              .doc(match.matieId)
              .get()
              .then((doc) => {
                const matieData = doc.data();
                setMatieDatas((datas) => [...datas, matieData]);
                setHasMatie(true);
              });
            if (index == data.matches.length - 1) {
              setRefreshing(false);
              setMatieDatasLoaded(true);
            }
          });
        }
        else{
          setMatieDatasLoaded(true);
        }
      });
  };

  return (
    <View style={styles.container}>
      {!matieDatasLoaded&&(
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
      {matieDatasLoaded && (
        <>
          {hasMatie ? (
            <FlatList
              refreshing={refreshing}
              onRefresh={fetchMatieDatas}
              numColumns={2}
              data={matieDatas}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('MatieProfileScreen', {
                      matieId: item.id,
                      matchId: userData.matches.find(
                        (match) => match.matieId === item.id
                      ).matchId,
                    });
                  }}
                >
                  <CardItem
                    image={item.image}
                    name={item.name}
                  />
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image source={emptyMatie} style={{
                height: 200,
                width: 200,
                resizeMode: 'contain'
              }} />
              <Text style={{textAlign: 'center', fontSize: 16, color: DARK_GRAY, paddingHorizontal: 52}}>Chưa có ai đã ghép đôi với bạn</Text>
              <Button title='Tìm Matie ngay' onPress={()=>navigation.navigate('FindScreen')} />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 10,
  },
});
