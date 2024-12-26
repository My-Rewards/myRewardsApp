import { localData } from '@/app-data/appData';
import { ExpandedShop } from '@/components/shopPreview';
import { color_pallete } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { 
  ActivityIndicator, 
  Text, 
  View,
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';


export default function shopPage() {
  const { shopPreviewCache } = localData();
  const { parentPage } = useLocalSearchParams<{ parentPage: string }>();

  if(shopPreviewCache){
    return(
      <View style={{ flex: 1 }}>
        <View>
          <SafeAreaView />
          <View style={[styles.header, {paddingBottom:5}]}>
              <SafeAreaView />
              <TouchableOpacity style={styles.headerContainerButton} onPress={()=>{router.back()}}>
                <Ionicons name={'chevron-back'} size={16} color={color_pallete[2]}/>
                <Text style={styles.headerText}>
                  Back to {parentPage}
                </Text>
              </TouchableOpacity>
            </View>
        </View>
        {shopPreviewCache?
        <View style={{ flex: 1 }}>
          <ExpandedShop 
          selectedPin={shopPreviewCache} 
          isExpanded={true} 
          setExpansion={undefined} 
          type={1} 
          />
        </View>
        :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>
            <ActivityIndicator />
          </Text>
        </View>
      }
      </View>
    )
  }
  
  return(
    <View>
      <View>
        <SafeAreaView />
        <View style={[styles.header, {paddingBottom:5}]}>
            <SafeAreaView />
            <TouchableOpacity style={styles.headerContainerButton} onPress={()=>{router.back()}}>
              <Ionicons name={'chevron-back'} size={16} color={color_pallete[2]}/>
              <Text style={styles.headerText}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
      </View>
      {shopPreviewCache?
      <View style={{ flex: 1 }}>
        <ExpandedShop 
        selectedPin={shopPreviewCache} 
        isExpanded={true} 
        setExpansion={undefined} 
        type={1} 
        />
      </View>
      :
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          <ActivityIndicator />
        </Text>
      </View>
    }
    </View>
  )
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: 'whitesmoke',
    elevation: 0,
    shadowOpacity: 0.1,
    borderBottomWidth:2,
    shadowColor:'black',
    shadowRadius:3,
    shadowOffset:{
      height:5,
      width:0
    },
    borderBottomColor:color_pallete[2],
  },
  headerContainerButton:{
    paddingLeft:'4%',
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:6,
    gap:5
  },

  headerText:{
    fontSize: 16,
    fontWeight: '500',
    fontFamily:'Avenir Next',
    color:color_pallete[2],
  },
})