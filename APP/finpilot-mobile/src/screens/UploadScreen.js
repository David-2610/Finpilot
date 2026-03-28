import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useFinance } from '../hooks';
import { COLORS } from '../utils/theme';

export default function UploadScreen() {
    const { uploadCSV } = useFinance();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handlePickAndUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
            if (result.canceled) return;

            const file = result.assets[0];
            setLoading(true);
            setStatus('Uploading statement...');
            await uploadCSV(file.uri, file.name);
            setStatus('Upload successful! Data mapped.');
            Alert.alert('Success', 'Statement uploaded and categorized.');
        } catch (error) {
            console.error(error);
            setStatus('Failed to upload statement.');
            Alert.alert('Error', 'Could not process statement.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.dropZone}>
                    <Text style={styles.icon}>📤</Text>
                    <Text style={styles.title}>Upload Bank Statement</Text>
                    <Text style={styles.subtitle}>Select a CSV file from your device</Text>
                    
                    <TouchableOpacity style={styles.button} onPress={handlePickAndUpload} disabled={loading}>
                        {loading ? <ActivityIndicator color={COLORS.warmWhite} /> : <Text style={styles.buttonText}>Browse Files</Text>}
                    </TouchableOpacity>
                </View>

                {status ? <Text style={styles.status}>{status}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: COLORS.warmWhite, justifyContent: 'center' },
    card: { backgroundColor: COLORS.glass, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: COLORS.glassBorder },
    dropZone: { alignItems: 'center', padding: 40, borderWidth: 2, borderColor: COLORS.mist, borderStyle: 'dashed', borderRadius: 12 },
    icon: { fontSize: 40, marginBottom: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: COLORS.charcoal, marginBottom: 8 },
    subtitle: { fontSize: 14, color: COLORS.slate, marginBottom: 24, textAlign: 'center' },
    button: { backgroundColor: COLORS.sage, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
    buttonText: { color: COLORS.warmWhite, fontSize: 16, fontWeight: '600' },
    status: { marginTop: 20, textAlign: 'center', color: COLORS.charcoal, fontSize: 14 },
});
