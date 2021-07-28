import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { setMatchData } from '../../redux/matchSlice';
import { PRIMARY_COLOR } from '../../assets/styles';
import firebase from '../../firebase/config'

export default function CommitmentScreen({route, navigation }) {  
  const {matchId} = route.params;
  const userData = useSelector((state) => state.user.data);
  const matchData = useSelector((state) => state.match.data);
  const dispatch = useDispatch();
  const [commitment,setCommitment] = useState(null);
  const matchesRef = firebase.firestore().collection('matches');

  useEffect(()=>{
    const getCommitmentFromDb = () => {
      matchesRef.doc(matchId).onSnapshot(doc => {
        setCommitment(doc.data().commitment);
      })
    }
    getCommitmentFromDb();
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
      return commitment.detail[index].id
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
  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Tên</DataTable.Title>
          <DataTable.Title numeric>{getBothStatus()}</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>{getUserNameByIndex(commitment,0)}</DataTable.Cell>
          <DataTable.Cell numeric>{getUserStatusByIndex(commitment,0)}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>{getUserNameByIndex(commitment,1)}</DataTable.Cell>
          <DataTable.Cell numeric>{getUserStatusByIndex(commitment,1)}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      {getHandleStatus()!=''?<TouchableOpacity 
        onPress={()=>navigation.navigate('SelectPackScreen')} 
        style={styles.button}
        disabled={(getHandleStatus()==='Đã cam kết')}
        >
        <Text style={styles.buttonText} >{getHandleStatus()}</Text>
      </TouchableOpacity>:<View/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
