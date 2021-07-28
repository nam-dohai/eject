import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {NameSettingScreen, DescriptionSettingScreen, LevelSettingScreen,GoalSettingScreen,LocationSettingScreen, ImageUploadScreen, SubmitScreen} from '../screens/SettingStack'

export default function SettingStack() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={{
            title: 'Nhập thông tin',
            headerBackTitleVisible: false,
        }}>
            <Stack.Screen name="NameSetting" component={NameSettingScreen} />
            <Stack.Screen name="DescriptionSetting" component={DescriptionSettingScreen} />
            <Stack.Screen name="LevelSetting" component={LevelSettingScreen} />
            <Stack.Screen name="GoalSetting" component={GoalSettingScreen} />
            <Stack.Screen name="LocationSetting" component={LocationSettingScreen} />
            <Stack.Screen name="ImageUploadScreen" component={ImageUploadScreen} />
            <Stack.Screen name="SubmitScreen" component={SubmitScreen} />
        </Stack.Navigator>
    )
}
