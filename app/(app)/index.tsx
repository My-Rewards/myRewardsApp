import { Text, View } from 'react-native';

import { useSession } from '../../auth/ctx';

export default function Home() {
  const { signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is the Home Page</Text>
      <Text
        onPress={() => {
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}
