import React from 'react';
import { createBottomTabNavigator } from '@react-native-bottom-tabs';
import { createNativeStackNavigator } from '@react-native-native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../hooks';
import { COLORS } from '../utils/theme';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import UploadScreen from '../screens/UploadScreen';
import ChatScreen from '../screens/ChatScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AlertsScreen from '../screens/AlertsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.warmWhite },
                headerTintColor: COLORS.charcoal,
                tabBarActiveTintColor: COLORS.sage,
                tabBarInactiveTintColor: COLORS.slate,
                tabBarStyle: { backgroundColor: COLORS.warmWhite, borderTopColor: COLORS.fog },
            }}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Dash', tabBarIcon: () => null }} />
            <Tab.Screen name="Upload" component={UploadScreen} options={{ tabBarIcon: () => null }} />
            <Tab.Screen name="Insights" component={ChatScreen} options={{ tabBarIcon: () => null }} />
            <Tab.Screen name="Txns" component={TransactionsScreen} options={{ tabBarIcon: () => null }} />
            <Tab.Screen name="Alerts" component={AlertsScreen} options={{ tabBarIcon: () => null }} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.warmWhite }}>
                <ActivityIndicator size="large" color={COLORS.sage} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <Stack.Screen name="Main" component={MainTabs} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
