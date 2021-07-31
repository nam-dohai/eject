import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import { WHITE, GRAY, DARK_GRAY, BLACK, HEADING, SUB_HEADING, PARAGRAPH } from '../../assets/styles';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import { getDistance } from '../../api/goong';
import { useSelector, useDispatch } from 'react-redux';
import { setMatchData } from '../../redux/matchSlice';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'


export default function MatchProfileScreen({ route, navigation }) {
  const userData = useSelector((state) => state.user.data);
  const [distance, setDistance] = useState('');
  const { matieId, matchId } = route.params;
  const matchData = useSelector((state) => state.match.data);
  const dispatch = useDispatch();
  const [commitment,setCommitment] = useState(null);
  const usersRef = firestore().collection('users');
  const matchesRef = firestore().collection('matches');
  const [matieData,setMatieData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchMatieData = async () => {
      await usersRef.doc(matieId).get()
      .then(response => {
        const data =  response.data();
        setMatieData(data);
        setLoading(false);
      })
    }
    fetchMatieData();
  },[])

  useEffect(()=>{
    var unsubscribe;
    const getCommitmentFromDb = () => {
      unsubscribe = matchesRef.doc(matchId).onSnapshot(doc => {
        setCommitment(doc.data().commitment);
      })
    }
    getCommitmentFromDb();
    return()=>{
      unsubscribe();
    }
  },[]);

  useEffect(()=>{
    if (commitment === null) return;
    dispatch(
      setMatchData({
        ...matchData,
        id: matchId,
        commitment:commitment,
        message:"Chưa làm",
      })
    );
  },[commitment])

  const getBothStatus = () => {
    if (commitment){
      if (commitment.name)
        return commitment.name
      else
        return "Chưa cam kết"
    }
    else 
      return ""
  }

  const getUserNameByIndex = (commitment, index) => {
    if (commitment){
      return commitment.detail[index].name
    }
    return "";
  }

  const getUserStatusByIndex = (commitment, index) => {
    if (commitment){
      const user = commitment.detail[index];
      if (!user.paid)
        return "Chưa cam kết";
      else{
        if (!user.isConfirmed)
          return "Đang chờ xác nhận";
        else
          return "Đã cam kết"
      }
    }
    return ""
  }

  const getUser = () => {
    return commitment.detail.find((matie)=> matie.id === userData.id);
  }

  const getHandleStatus = () => {
    if (commitment){
      if (getUserStatusByIndex(commitment,0) === 'Đã cam kết' && getUserStatusByIndex(commitment,1) === 'Đã cam kết'){
        return "Đã cam kết"
      }
      else{
        if (getUser().paid)
          return ""
        else
          return "Cam kết!"
      }
    }
    return ""
  }
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
          // fontWeight: '500'
          flex: 1
        }}>{title}</Text>
      </View>
    )
  }
  return (
    <ScrollView style={styles.scrollView}>
      {loading===false?<View style={styles.container}>
        <Image
          source={{
            uri: matieData.image,
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
          <Text style={styles.name}>{matieData.name}</Text>
          <Button compact title="Nhắn tin" style={styles.button} onPress={()=>navigation.navigate('ChatStack', {
            screen: 'ChatListScreen'
          })} />
          <ListItem icon={<Icon name='account' size={16} />} title={matieData.level} />
          <ListItem icon={<Icon name='target' size={16} />} title={matieData.goal} />
          <ListItem icon={<Icon name='map-marker' size={16} />} title={matieData.placeData.main + ', ' + matieData.placeData.secondary} />
          <ListItem icon={<Icon name='comment-text' size={16} />} title={matieData.description} />
        </View>

        {/* <View style={styles.buttonRow}>
          {getHandleStatus()!=''?<Button
            title={getHandleStatus()}
            style={styles.button}
            disabled={(getHandleStatus()==='Đã cam kết')}
            onPress={() => {
              navigation.navigate('SelectPackScreen');
            }}
          />:<View/>}
          <Button mode='outline' title="Nhắn tin" style={styles.button} onPress={()=>navigation.navigate('ChatStack', {
            screen: 'ChatListScreen'
          })} />
        </View>
        <Text style={{
          ...HEADING,
          fontSize: 22,
          marginTop: 32,
        }}>Trạng thái cam kết</Text>
        <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title><Text style={styles.tableTitle}>Tên</Text></DataTable.Title>
          <DataTable.Title numeric><Text style={styles.tableTitle}>{getBothStatus()}</Text></DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell><Text style={styles.tableCell}>{getUserNameByIndex(commitment,0)}</Text></DataTable.Cell>
          <DataTable.Cell numeric><Text style={styles.tableCell}>{getUserStatusByIndex(commitment,0)}</Text></DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell><Text style={styles.tableCell}>{getUserNameByIndex(commitment,1)}</Text></DataTable.Cell>
          <DataTable.Cell numeric><Text style={styles.tableCell}>{getUserStatusByIndex(commitment,1)}</Text></DataTable.Cell>
        </DataTable.Row>
      </DataTable> */}
      </View>:<View/>}
    </ScrollView>
  );
}
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
    // dùng khi có 2 button và button row đc uncomment
    // flex: 1,
    // marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 32,
    paddingHorizontal: 10,
  },
  table: {
    paddingHorizontal: 4,
    ...PARAGRAPH,
  },
  tableCell:{
    ...PARAGRAPH,
  },
  tableTitle: {
    fontSize: 14,
  }
});