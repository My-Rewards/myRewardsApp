import { View, Text} from "react-native"

export const LoadingScreen = () =>{
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading... </Text>
        </View>
    )
}