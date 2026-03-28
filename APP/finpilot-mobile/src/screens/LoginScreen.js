import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks';
import { COLORS } from '../utils/theme';

export default function LoginScreen() {
    const { login, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) return;
        setIsLoading(true);
        try {
            await login(email, password);
        } catch { /* Handled in context */ }
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FinPilot</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.slate}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.slate}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color={COLORS.warmWhite} /> : <Text style={styles.buttonText}>Sign In</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: COLORS.warmWhite,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.charcoal,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.slate,
        marginBottom: 32,
        textAlign: 'center',
    },
    input: {
        backgroundColor: COLORS.fog,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        color: COLORS.charcoal,
    },
    button: {
        backgroundColor: COLORS.sage,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: COLORS.warmWhite,
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: COLORS.error,
        marginBottom: 16,
        textAlign: 'center',
    },
});
