import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { MatchScreen, MatieProfileScreen, CommitmentScreen, PaymentScreen, SelectPackScreen } from '../screens/MatchStack';

export default function MatchStack() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={{
            headerBackTitleVisible: false,
        }}>
            <Stack.Screen name="MatchScreen" component={MatchScreen} options={{
                title: 'Đã ghép đôi',
            }} />
            <Stack.Screen name="MatieProfileScreen" component={MatieProfileScreen} options={{
                title: 'Thông tin Matie',
            }} />
            <Stack.Screen name="CommitmentScreen" component={CommitmentScreen} options={{
                title: 'Thông tin cam kết',
            }} />
            <Stack.Screen name="SelectPackScreen" component={SelectPackScreen} options={{
                title: 'Chọn gói cam kết',
            }} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{
                title: 'Thông tin chuyển khoản',
            }} />
        </Stack.Navigator>
    )
}
