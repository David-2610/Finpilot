import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, CATEGORY_COLORS } from '../utils/theme';

export function SpendingBar({ categoryBreakdown = [] }) {
    if (!categoryBreakdown || categoryBreakdown.length === 0) {
        return <Text style={styles.noDataText}>No spending data available</Text>;
    }

    const total = categoryBreakdown.reduce((sum, item) => sum + (item.amount || 0), 0);
    if (total === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.barContainer}>
                {categoryBreakdown.map((item, idx) => {
                    const widthPercent = (item.amount / total) * 100;
                    return (
                        <View
                            key={idx}
                            style={[
                                styles.barSegment,
                                {
                                    width: `${widthPercent}%`,
                                    backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
                                }
                            ]}
                        />
                    );
                })}
            </View>
            <View style={styles.legendContainer}>
                {categoryBreakdown.slice(0, 4).map((item, idx) => (
                    <View key={idx} style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }]} />
                        <Text style={styles.legendText} numberOfLines={1}>
                            {item.categoryName} ({((item.amount / total) * 100).toFixed(0)}%)
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    noDataText: {
        color: COLORS.slate,
        textAlign: 'center',
        marginVertical: 20,
    },
    barContainer: {
        height: 12,
        flexDirection: 'row',
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: COLORS.fog,
        marginBottom: 16,
    },
    barSegment: {
        height: '100%',
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginBottom: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: COLORS.softCharcoal,
        flex: 1,
    },
});
