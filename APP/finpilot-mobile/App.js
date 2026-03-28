import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { FinanceProvider } from './src/contexts/FinanceContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
    return (
        <AuthProvider>
            <FinanceProvider>
                <AppNavigator />
            </FinanceProvider>
        </AuthProvider>
    );
}
