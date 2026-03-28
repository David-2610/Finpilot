import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useFinance } from '../hooks';
import { COLORS } from '../utils/theme';
import { GlassCard } from '../components/Cards';

export default function ChatScreen() {
    const { fetchChat, stopVoice } = useFinance();
    const [messages, setMessages] = useState([
        { id: 1, type: 'ai', text: 'Hello! I am your FinPilot AI. How can I help you today?' },
    ]);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!prompt.trim()) return;
        const userMsg = { id: Date.now(), type: 'user', text: prompt };
        setMessages(prev => [...prev, userMsg]);
        setPrompt('');
        setLoading(true);

        try {
            const data = await fetchChat(userMsg.text);
            const aiMsg = { id: Date.now()+1, type: 'ai', text: data.text || 'Sorry, I failed to process that.' };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now()+1, type: 'ai', text: 'Error connecting to AI service.' }]);
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.header}>
                <Text style={styles.title}>AI Advisor</Text>
                <TouchableOpacity onPress={stopVoice} style={styles.stopBtn}>
                    <Text style={styles.stopText}>Stop Audio</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingBottom: 20 }}>
                {messages.map((m) => (
                    <View key={m.id} style={[styles.bubbleWrap, m.type === 'user' ? styles.userWrap : styles.aiWrap]}>
                        <View style={[styles.bubble, m.type === 'user' ? styles.userBubble : styles.aiBubble]}>
                            <Text style={styles.messageText}>{m.text}</Text>
                        </View>
                    </View>
                ))}
                {loading && <ActivityIndicator color={COLORS.sage} style={{ alignSelf: 'flex-start', marginLeft: 16 }} />}
            </ScrollView>

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask FinPilot..."
                    value={prompt}
                    onChangeText={setPrompt}
                    onSubmitEditing={handleSend}
                    placeholderTextColor={COLORS.slate}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading || !prompt.trim()}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.warmWhite },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: COLORS.fog },
    title: { fontSize: 20, fontWeight: 'bold', color: COLORS.charcoal },
    stopBtn: { backgroundColor: COLORS.fog, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
    stopText: { fontSize: 12, color: COLORS.charcoal },
    chatArea: { flex: 1, padding: 16 },
    bubbleWrap: { marginBottom: 16, maxWidth: '80%' },
    userWrap: { alignSelf: 'flex-end' },
    aiWrap: { alignSelf: 'flex-start' },
    bubble: { padding: 12, borderRadius: 12 },
    userBubble: { backgroundColor: COLORS.sage, borderBottomRightRadius: 4 },
    aiBubble: { backgroundColor: COLORS.fog, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.mist },
    messageText: { fontSize: 16, color: COLORS.charcoal, lineHeight: 22 },
    inputArea: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderColor: COLORS.fog, backgroundColor: COLORS.warmWhite },
    input: { flex: 1, backgroundColor: COLORS.fog, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, color: COLORS.charcoal },
    sendBtn: { backgroundColor: COLORS.sage, borderRadius: 20, paddingHorizontal: 16, justifyContent: 'center' },
    sendText: { color: COLORS.warmWhite, fontWeight: 'bold' },
});
