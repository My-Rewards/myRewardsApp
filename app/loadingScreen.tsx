import { View, Text} from "react-native"

export const LoadingScreen = () =>{
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
            <Text>Loading... </Text>
        </View>
    )
}