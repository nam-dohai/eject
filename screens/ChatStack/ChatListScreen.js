import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import * as Linking from 'expo-linking';
import emptyMessages from '../../assets/empty-messages.png';
import { DARK_GRAY } from '../../assets/styles';

export default function ChatListScreen({navigation}) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={emptyMessages} style={{
          height: 200,
          width: 200,
          resizeMode: 'contain'
        }} />
        <Text style={{textAlign: 'center', fontSize: 16, color: DARK_GRAY, paddingHorizontal: 32}}>Bạn vui lòng tham gia nhóm chat trên Zalo của BeeMatie nhé!</Text>
        <Button style={{marginTop: 16}} title="Tham gia nhóm chat" onPress={()=>{
          Linking.openURL('https://zalo.me/g/hrgwva608'); 
        }} />
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
