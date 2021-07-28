import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import handshake from '../../assets/handshake.png';
import match from '../../assets/match.png';
import plan from '../../assets/plan.png';
import Button from '../../components/Button';
import { BLACK, HEADING, SUB_HEADING } from '../../assets/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ setShowedOnboarding }) {
  const [ref, setRef] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    pager: {
      flex: 1,
    },
    page: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 32,
      marginBottom: 24,
    },
    image: {
      width: '100%',
      height: '50%',
      resizeMode: 'contain',
    },
    title: {
      ...HEADING,
      marginTop: 16,
      marginLeft: 32,
    },
    body: {
      ...SUB_HEADING,
      marginTop: 8,
      marginHorizontal: 32,
    },
    nextButton: {
      shadowOpacity: 0.1,
      shadowRadius: 15,
      shadowColor: BLACK,
      shadowOffset: { height: 10, width: -15 },
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        ref={(r) => setRef(r)}
        scrollEnabled={false}
        style={styles.pager}
      >
        <View style={styles.page} key="1">
          <Image source={handshake} style={styles.image} />
          <Text style={styles.title}>Ghép đôi 1:1</Text>
          <Text style={styles.body}>
            Chọn bạn học phù hợp cùng nhau chinh phục tiếng Anh
          </Text>
        </View>
        <View style={styles.page} key="2">
          <Image source={match} style={styles.image} />
          <Text style={styles.title}>30 phút mỗi ngày</Text>
          <Text style={styles.body}>
            Sử dụng thời gian hợp lí để nâng cao trình độ bản thân
          </Text>
        </View>
        <View style={styles.page} key="3">
          <Image source={plan} style={styles.image} />
          <Text style={styles.title}>Lộ trình học hợp lí</Text>
          <Text style={styles.body}>Được xây dựng với các cấp độ phù hợp với tất cả mọi người</Text>
        </View>
      </PagerView>
      <View style={styles.row}>
        <Button
          mode="text"
          title="Bỏ qua"
          onPress={async () => {
            await AsyncStorage.setItem('onboardingShowed', 'true');
            setShowedOnboarding(true);
          }}
        />
        <Button
          compact
          icon
          title="Tiếp"
          style={styles.nextButton}
          onPress={async () => {
            if (pageIndex == 2) {
              await AsyncStorage.setItem('onboardingShowed', 'true');
              setShowedOnboarding(true);
            } else {
              ref.setPage(pageIndex + 1);
              setPageIndex(pageIndex + 1);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
