import { 
  Animated, 
  Text, 
  TouchableWithoutFeedback, 
  View, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import React, { useRef } from 'react';
import { color_pallete } from '@/constants/Colors';
import { localData } from '@/app-data/appData';
import { Plan, shopPreview } from '@/app-data/data-types';
import { SvgXml } from 'react-native-svg';
import { mediumLogo } from '@/assets/images/MR-logos';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function plansPage() {  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { plans, fetchPlans, isPage3Loading} = localData();

  const handlePress = (filterSelection: number) => {
    Animated.timing(slideAnim, {
      toValue: filterSelection * (width / 2),
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      try {
        fetchPlans(filterSelection);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    });
  };

  const openShopPage = (shop_id:string) =>{
    router.push({ pathname: "/shopPage", params:{ parentPage:'Plans', shop_id }});
  }

  return(
    <View style={styles.page}>
      <FilterBar slideAnim={slideAnim} handlePress={handlePress}/>
      <PlansPreview plansData={plans} isLoading={isPage3Loading} openShop={openShopPage}/>
    </View>
  )
}

const FilterBar = React.memo(({ slideAnim, handlePress }: any) => {
  return (
    <View style={styles.filterBar}>
      <Animated.View
        style={[
          styles.indicator,
          { transform: [{ translateX: slideAnim }] },
        ]}
      />
      {[0, 1].map((filterSelection) => (
        <TouchableWithoutFeedback
          key={filterSelection}
          onPress={() => handlePress(filterSelection)}
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.filterText}>
              {filterSelection === 0 ? 'myPlan' : 'Favorites'}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
});

const PlansPreview = React.memo(({ plansData, isLoading, openShop }:
   { plansData: Plan[]|null|undefined; isLoading: boolean, openShop:(shop_id: string)=>void }) => {

  if (!isLoading && plansData) {
    return (
      <View style={{flex:1, width:'100%'}}>
        {plansData && plansData.length !== 0? 
          <View  style={styles.previewContainer}>
            <TouchableOpacity style={styles.discoverButton}>
              <Text style={styles.btnText}>discover more</Text>
            </TouchableOpacity>
            {          
              plansData.map((plan:Plan) => (
                <View key={plan.id}>
                  <TouchableOpacity onPress={()=>openShop(plan.id)}>
                    <Text>{plan.name}</Text>
                    <Text>{plan.points}</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
          </View>
        :
        (
          <View style={styles.empty}>
            <SvgXml
              xml={mediumLogo}
              height={width/4}
              width={width*0.7}
              color={color_pallete[1]}
            />
            <Text style={styles.txt1}> Start earning rewards today by creating your first custom plan! </Text>
            <TouchableOpacity style={styles.discoverButton2}>
              <Text style={styles.btnText2}>discover more</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  else {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  filterBar: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    zIndex: 100,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: color_pallete[0],
    borderBottomWidth: 2,
  },
  page: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filterText: {
    fontFamily: 'Avenir Next',
    fontWeight: '600',
    color: color_pallete[2],
    fontSize: 13,
    padding: 10,
  },
  indicator: {
    position: 'absolute',
    height: '100%',
    left: -15,
    width: width / 2 + 30,
    backgroundColor: color_pallete[0],
    borderRadius: 20,
  },
  loading:{
    flex:1,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  empty:{
    display:'flex',
    flex:1,
    width:'100%',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingTop:'40%'
  },
  previewContainer:{
    display:'flex',
    flex:1,
    width:'100%',
    justifyContent:'flex-start',
    alignItems:'center',
    margin:10,
    marginVertical:40,
    gap:30
  },
  discoverButton:{
    borderRadius:10,
    borderWidth:1.5, 
    borderColor:color_pallete[5],
    width:'80%',
    padding:10
  },
  btnText:{
    color:color_pallete[5],
    fontFamily:'Avenir Next',
    fontSize:18,
    alignSelf:'center',
    fontWeight:'700'
  },
  discoverButton2:{
    borderRadius:10,
    backgroundColor:color_pallete[3],
    width:'80%',
    padding:10
  },
  btnText2:{
    color:'white',
    fontFamily:'Avenir Next',
    fontSize:18,
    alignSelf:'center',
    fontWeight:'700'
  },
  txt1:{
    color:color_pallete[2],
    fontFamily:'Avenir Next',
    fontWeight:'600',
    textAlign:'center',
    width:'70%',
    marginBottom: '8%'
  }
});
