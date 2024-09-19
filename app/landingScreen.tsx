import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useSession } from '../auth/ctx';

export default function landingScreen() {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Welcome to myRewards
      </Text>
      <Text onPress={()=>{router.replace('/sign-in')}}>
        Login
      </Text>
      <Text onPress={()=>{router.replace('/sign-up')}}>
        Sign Up
      </Text>
    </View>
  );
}
