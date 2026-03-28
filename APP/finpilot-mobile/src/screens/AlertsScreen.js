import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

const MOCK_ALERTS = [
    { id: '1', title: 'Large Withdrawal Detected', message: '₹50,000 was withdrawn from HDFC ending 1234.', type: 'critical' },
    { id: '2', title: 'Upcoming Bill', message: 'Credit card bill ₹12,000 due in 3 days.', type: 'warning' },
    { id: '3', title: 'Unusual Spending Category', message: 'Dining expenses 200% higher than last month.', type: 'info' },
];

export default function AlertsScreen() {
    const alertColors = { critical: COLORS.blush, warning: COLORS.paleGold, info: COLORS.sage };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={[styles.border, { backgroundColor: alertColors[item.type] }]} />
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.pageTitle}>Alerts & Notifications</Text>
            </View>
            <FlatList
                data={MOCK_ALERTS}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.warmWhite },
    header: { padding: 16, borderBottomWidth: 1, borderColor: COLORS.fog },
    pageTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.charcoal },
    list: { padding: 16 },
    card: { flexDirection: 'row', backgroundColor: COLORS.glass, borderRadius: 12, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.glassBorder },
    border: { width: 6 },
    content: { padding: 16, flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold', color: COLORS.charcoal, marginBottom: 4 },
    message: { fontSize: 14, color: COLORS.softCharcoal, lineHeight: 20 },
});
