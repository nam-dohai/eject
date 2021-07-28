import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FindScreen } from '../screens/FindStack';

export default function FindStack() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen name="FindScreen" component={FindScreen} options={{
                title: 'Tìm kiếm',
            }} />
        </Stack.Navigator>
    )
}
