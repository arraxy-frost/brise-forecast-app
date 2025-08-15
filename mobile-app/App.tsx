import React from 'react';
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
} from 'react-native';

export default function App() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const buttonColor = React.useRef(new Animated.Value(0)).current;

    const handleLogin = () => {
        if (isLoading) return;

        Animated.timing(buttonColor, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setIsLoading(true);
        console.log('Email:', email, 'Password:', password);

        setTimeout(() => {
            setIsLoading(false);

            Animated.timing(buttonColor, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }, 2000);
    };

    const bgColor = buttonColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#3498db', '#95a5a6'], // От синего к серому
    });

    const textColor = buttonColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ffffff', '#e0e0e0'] // От белого к светло-серому
    });

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>☀️ Brise Forecast</Text>
                        <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>
                    </View>

                    <View style={styles.form}>
                        <TextInput
                            style={[
                                styles.input,
                                isLoading && styles.disabledInput,
                                isLoading && styles.disabledTextInput
                            ]}
                            placeholder="email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#999"
                            editable={!isLoading}
                        ></TextInput>
                        <TextInput
                            style={styles.input}
                            placeholder="password"
                            secureTextEntry
                            autoCapitalize="none"
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="#999"
                            editable={!isLoading}
                        ></TextInput>

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.7}
                        >
                            <Animated.View style={[styles.button, { backgroundColor: bgColor }]}>
                                {
                                    isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) :
                                        (
                                            <Animated.Text style={[styles.buttonText, { color: textColor}]}>
                                                {isLoading ? 'Вход' : 'Войти'}
                                            </Animated.Text>
                                        )
                                }
                            </Animated.View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.forgotButton}
                            disabled={isLoading}
                        >
                            <Text style={styles.forgotText}>Забыли пароль?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Еще нет аккаунта?</Text>
                        <TouchableOpacity disabled={isLoading}>
                            <Text style={styles.footerText}>
                                Зарегистрироваться
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    disabledInput: {
        backgroundColor: '#f0f0f0',
        borderColor: '#e0e0e0',
    },
    disabledText: {
        color: '#b0b0b0',
    },
    disabledTextInput: {
        color: '#999', // Серый цвет текста
    },
    buttonContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        paddingTop: 40,
        paddingBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c3e50',
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 8,
    },
    form: {
        paddingHorizontal: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        height: 50,
        borderRadius: 8,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        minWidth: 100, // Чтобы кнопка не "прыгала" при замене текста на индикатор
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        // color удаляем из здесь, так как будем управлять им анимацией
    },
    forgotButton: {
        alignSelf: 'center',
        marginTop: 15,
    },
    forgotText: {
        color: '#3498db',
        fontSize: 14,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingVertical: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#7f8c8d',
        fontSize: 14,
    },
    footerLink: {
        color: '#3498db',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 5,
    },
});