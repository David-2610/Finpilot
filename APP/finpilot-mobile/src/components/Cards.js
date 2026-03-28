import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

export function GlassCard({ children, style }) {
    return (
        <View style={[styles.glassCard, style]}>
            {children}
        </View>
    );
}

export function StatCard({ icon, value, label, accentColor = COLORS.sage }) {
    return (
        <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${accentColor}20` }]}>
                <Text style={styles.icon}>{icon}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.value}>{value}</Text>
                <Text style={styles.label}>{label}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    glassCard: {
        backgroundColor: COLORS.glass,
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        shadowColor: COLORS.charcoal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    statCard: {
        backgroundColor: COLORS.warmWhite,
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.fog,
        shadowColor: COLORS.slate,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 24,
    },
    content: {
        flex: 1,
    },
    value: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.charcoal,
    },
    label: {
        fontSize: 14,
        color: COLORS.slate,
        marginTop: 4,
    },
});
