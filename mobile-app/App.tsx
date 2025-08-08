import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>☀️ Brise Forecast (Expo)</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eef2f5',
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
    },
});
