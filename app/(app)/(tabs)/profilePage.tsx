import { Text, View } from 'react-native';
import { useSession } from '../../../auth/ctx';
import { localData } from '@/app-data/appData';

export default function profilePage() {
  const { signOut } = useSession();
  const { profile } = localData();

  if(!profile){
    return(
      <View>

      </View>
    )
  }else{
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This is the Profile page</Text>
        <Text
          onPress={() => {
            signOut();
          }}>
          Sign Out
        </Text>
        <Text>{profile.first_name}</Text>
        <Text>{profile.last_name}</Text>
        <Text>{profile.dob.toUTCString()}</Text>
        <Text>{profile.username}</Text>
        <Text>{profile.first_name}</Text>
      </View>
    );
  }
}
