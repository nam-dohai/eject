import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigation from './navigation/RootNavigation';
import store from './redux/store';
import { Provider } from 'react-redux';
import OnboardingScreen from './screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { LogBox } from 'react-native';

export default function App() {
  const [showedOnboarding, setShowedOnboarding] = useState(false);
  useEffect(() => {
    const set = async () => {
      const onboardingShowed = await AsyncStorage.getItem('onboardingShowed');
      if (onboardingShowed != null) {
        if (onboardingShowed == 'false') {
          setShowedOnboarding(false);
        }
        if (onboardingShowed == 'true') {
          setShowedOnboarding(true);
        }
      }
    };
    set();
  }, []);
  
  
  LogBox.ignoreLogs(['Setting a timer']);
  return (
    <Provider store={store}>
      {showedOnboarding ? (
        <RootNavigation />
      ) : (
        <OnboardingScreen setShowedOnboarding={setShowedOnboarding} />
      )}
      <StatusBar style="auto" />
    </Provider>
  );
}
