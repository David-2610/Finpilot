import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth, useFinance } from '../hooks';
import { COLORS } from '../utils/theme';
import { StatCard, GlassCard } from '../components/Cards';
import { SpendingBar } from '../components/SpendingBar';

export default function DashboardScreen({ navigation }) {
    const { user } = useAuth();
    const {
        transactions, summary, aiInsight, categoryBreakdown,
        loading, hasData, loadDashboardData, fetchAIInsights,
    } = useFinance();

    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => { loadDashboardData(); }, [loadDashboardData]);

    const handleGetInsights = async () => {
        if (!summary) return;
        setAiLoading(true);
        try { await fetchAIInsights(summary); } catch { }
        setAiLoading(false);
    };

    if (!hasData && !loading) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No data yet. Upload a statement first.</Text>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Upload')}>
                    <Text style={styles.btnText}>Go to Upload</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const totalIncome = summary?.totalIncome || 0;
    const totalExpenses = summary?.totalExpenses || 0;
    const savings = totalIncome - totalExpenses;
    const rate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;
    const catBreak = summary?.categoryBreakdown || [];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.header}>Welcome back, {user?.name?.split(' ')[0]}</Text>

            <StatCard icon="💰" value={`₹${totalIncome.toLocaleString('en-IN')}`} label="Total Income" accentColor={COLORS.sage} />
            <StatCard icon="💸" value={`₹${totalExpenses.toLocaleString('en-IN')}`} label="Total Expenses" accentColor={COLORS.blush} />
            <StatCard icon="📈" value={`${rate}%`} label="Savings Rate" accentColor={COLORS.dusk} />
            
            <GlassCard>
                <Text style={styles.cardTitle}>Spending by Category</Text>
                <SpendingBar categoryBreakdown={catBreak} />
            </GlassCard>

            <GlassCard>
                <View style={styles.row}>
                    <Text style={styles.cardTitle}>AI Insight</Text>
                    {aiLoading && <Text style={{ color: COLORS.slate }}>Generating...</Text>}
                </View>
                <Text style={styles.insightText}>{aiInsight || 'Tap generate for personalized financial advice.'}</Text>
                
                <View style={styles.aiActions}>
                    <TouchableOpacity style={styles.aiBtn} onPress={handleGetInsights}>
                        <Text style={styles.aiBtnText}>{aiInsight ? 'Regenerate' : 'Generate'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.aiBtn, styles.chatBtn]} onPress={() => navigation.navigate('Insights')}>
                        <Text style={styles.chatBtnText}>Chat</Text>
                    </TouchableOpacity>
                </View>
            </GlassCard>

            <GlassCard>
                <Text style={styles.cardTitle}>Recent Transactions</Text>
                {transactions.slice(0, 5).map(t => (
                    <View key={t._id} style={styles.txnRow}>
                        <View style={styles.txnLeft}>
                            <Text style={styles.txnName}>{t.merchant || t.rawDescription?.substring(0, 20)}</Text>
                            <Text style={styles.txnCat}>{t.categoryId?.name || 'Unknown'}</Text>
                        </View>
                        <Text style={[styles.txnAmp, { color: t.type === 'credit' ? COLORS.success : COLORS.charcoal }]}>
                            {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                        </Text>
                    </View>
                ))}
            </GlassCard>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.warmWhite },
    content: { padding: 16 },
    header: { fontSize: 24, fontWeight: 'bold', color: COLORS.charcoal, marginBottom: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: COLORS.slate, marginBottom: 16 },
    btn: { backgroundColor: COLORS.sage, padding: 12, borderRadius: 8 },
    btnText: { color: COLORS.warmWhite, fontWeight: '600' },
    cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.charcoal, marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    insightText: { fontSize: 14, color: COLORS.softCharcoal, lineHeight: 20, marginBottom: 16 },
    aiActions: { flexDirection: 'row', gap: 8 },
    aiBtn: { backgroundColor: COLORS.sage, padding: 8, borderRadius: 6, flex: 1, alignItems: 'center' },
    aiBtnText: { color: COLORS.warmWhite, fontWeight: '500' },
    chatBtn: { backgroundColor: COLORS.fog },
    chatBtnText: { color: COLORS.charcoal, fontWeight: '500' },
    txnRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.fog },
    txnLeft: { flex: 1 },
    txnName: { fontSize: 14, color: COLORS.charcoal, fontWeight: '500' },
    txnCat: { fontSize: 12, color: COLORS.slate },
    txnAmp: { fontSize: 14, fontWeight: '600' },
});
