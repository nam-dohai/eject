import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatListScreen, ChatScreen } from '../screens/ChatStack';

export default function ChatStack() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen name="ChatListScreen" component={ChatListScreen} options={{
                title: 'Tin nhắn',
            }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
    )
}
