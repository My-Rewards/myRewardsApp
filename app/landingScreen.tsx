import { router } from 'expo-router';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from '../auth/ctx';

export default function LandingScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>
                Welcome to myRewards
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/sign-in')}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/sign-up')}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    welcomeText: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff', // Blue color
        padding: 10,
        borderRadius: 5,
        marginVertical: 8,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff', // White color
        fontSize: 18,
    },
});
