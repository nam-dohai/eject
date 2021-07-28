import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, SignupScreen, PhoneLoginScreen, PinCodeScreen} from '../screens/LoginStack';

export default function LoginStack() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen name="PhoneLoginScreen" component={PhoneLoginScreen} options={{
                title: 'Đăng nhập'
            }} />

            <Stack.Screen name="PinCodeScreen" component={PinCodeScreen} options={{
                title: 'Xác nhận'
            }} />

            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{
                title: 'Đăng nhập'
            }} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} options={{
                title: 'Đăng ký'
            }} />
            
        </Stack.Navigator>
    )
}
