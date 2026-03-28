import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFinance } from '../hooks';
import { COLORS } from '../utils/theme';

export default function TransactionsScreen() {
    const { transactions, loading } = useFinance();

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <View style={styles.left}>
                <Text style={styles.merchant}>{item.merchant || item.rawDescription?.substring(0, 30)}</Text>
                <View style={styles.meta}>
                    <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                    <Text style={styles.category}>{item.categoryId?.name || 'Uncategorized'}</Text>
                </View>
            </View>
            <View style={styles.right}>
                <Text style={[styles.amount, { color: item.type === 'credit' ? COLORS.success : COLORS.charcoal }]}>
                    {item.type === 'credit' ? '+' : '-'}₹{item.amount.toLocaleString()}
                </Text>
                <Text style={styles.type}>{item.type}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Transactions</Text>
            </View>
            <FlatList
                data={transactions}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.empty}>No transactions found.</Text>}
                onRefresh={() => {}} 
                refreshing={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.warmWhite },
    header: { padding: 16, borderBottomWidth: 1, borderColor: COLORS.fog },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.charcoal },
    list: { padding: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.fog },
    left: { flex: 1 },
    merchant: { fontSize: 16, fontWeight: '500', color: COLORS.charcoal, marginBottom: 4 },
    meta: { flexDirection: 'row', gap: 12 },
    date: { fontSize: 12, color: COLORS.slate },
    category: { fontSize: 12, color: COLORS.dusk },
    right: { alignItems: 'flex-end' },
    amount: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    type: { fontSize: 10, color: COLORS.slate, textTransform: 'uppercase' },
    empty: { textAlign: 'center', color: COLORS.slate, marginTop: 40 },
});
