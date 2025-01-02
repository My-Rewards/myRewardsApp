import { 
  Animated, 
  Text, 
  TouchableWithoutFeedback, 
  View, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator, 
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { color_pallete } from '@/constants/Colors';
import { localData } from '@/app-data/appData';
import { ExpentiureProps, PreviewPlanProp, Tier } from '@/app-data/data-types';
import { SvgXml } from 'react-native-svg';
import { mediumLogo } from '@/assets/images/MR-logos';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useProps } from '@/app/LoadingProp/propsProvider';

const { width } = Dimensions.get('window');

type PlansPreviewProps = {
  plansData: PreviewPlanProp[] |null|undefined; 
  isLoading: boolean;
  openShop:(shop_id: string)=>void;
}

type PlansVisitMap = {
  milestone:[string, Tier], 
  index:number, 
  numMilestones:number, 
  parentWidth:number,
  checkpoints:number[]
}

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

  const openShopPage = (org_id:string) =>{
    router.push({ pathname: "/shopPage", params:{ parentPage:'Plans', org_id }});
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

const PlansPreview = React.memo(({ plansData, isLoading, openShop }:PlansPreviewProps) => {

  if (!isLoading && plansData) {
    return (
      <ScrollView style={{flex:1, width:'100%'}} showsVerticalScrollIndicator={false}>
        {plansData && plansData.length !== 0? 
          <View  style={styles.previewContainer}>
            <TouchableOpacity style={styles.discoverButton} onPress={()=>router.navigate('/')}>
              <Text style={styles.btnText}>discover more</Text>
            </TouchableOpacity>
            {          
              plansData.map((plan:PreviewPlanProp) => (
                <TouchableOpacity onPress={()=>openShop(plan.organization_id)} key={plan.id} style={styles.card}>
                  <PlanPreviewCard plan={plan} />
                </TouchableOpacity>
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
      </ScrollView>
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

const PlanPreviewCard = ({plan}:{plan:PreviewPlanProp}) =>{
  const [milestonePlan, setMilestonePlan] = useState<[string, Tier][]>();
  const [expenditurePlan, setExpenditurePlan] = useState<ExpentiureProps>();
  const [parentWidth, setParentWidth] = useState<number | null>(null);
  const [checkpoints, setCheckPoints] = useState<number[] | null>(null);
  const [liked, setLiked] = useState<boolean>(plan.favorite);
  const { alert } = useProps();

  useEffect(()=>{
    if(plan.reward_plan.road_map){
      setMilestonePlan(Object.entries(plan.reward_plan.road_map))
      setCheckPoints(Object.entries(plan.reward_plan.road_map).map(([checkpoint]) => parseInt(checkpoint, 10)));
    }
    if(plan.reward_plan.exp_rewards){
      setExpenditurePlan(plan.reward_plan.exp_rewards)
    }
  },[])

  const handleLike = () =>{
    if(!liked){
      alert('Saved to favorites! ', '', 'success')
    }
    setLiked(!liked)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }
  
  const PointStatus: React.FC<PlansVisitMap> = ({ milestone, index, numMilestones, parentWidth, checkpoints }) => {   
    const rewardRedeemable = plan.redeemableRewards.includes(milestone[1].id);
    const checkpoint = parseInt(milestone[0],10);
    const lineWidth = ((parentWidth - numMilestones * 25) / (numMilestones - 1)) * 0.8;

    const prevCheckpoint = checkpoints
    .filter((findCheckpoint:number) => findCheckpoint < checkpoint)
    .pop(); 

    const completion = prevCheckpoint ? plan.visits < prevCheckpoint ? 0 : plan.visits >= checkpoint ? 1 : (plan.visits%checkpoint)/checkpoint : 0;

    return(
      <View key={index} style={previewPlanStyle.stepContainer}>
          {index > 0 && (
            <View style={[previewPlanStyle.line, { width: lineWidth+2 }]}>
              <View style={[
                previewPlanStyle.completion, 
                { width: lineWidth*(completion), position:'absolute' },
                completion != 1 ? {borderTopRightRadius:4, borderBottomRightRadius:4}:null ]}>
                {completion > 0 && completion < 1 && (
                  <View style={previewPlanStyle.visitContainer}>
                    <Text style={previewPlanStyle.visitText}>{plan.visits}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          {plan.visits >= checkpoint && !rewardRedeemable ? (
          <View style={[previewPlanStyle.circle, { backgroundColor: 'white' }]}>
              <Ionicons name="checkmark" color={color_pallete[5]} />
          </View>
          ) : rewardRedeemable ?(                            
          <View style={[previewPlanStyle.circle, {backgroundColor:'white'}]}>
              <Ionicons name="star" color={color_pallete[5]} />
          </View>
          ):(
          <View style={[previewPlanStyle.circle]}>
              <Text style={previewPlanStyle.circleText}>{checkpoint}</Text>
          </View>
          )}
      </View>
    )
  }
  
  return(
    <View>
      <View style={previewPlanStyle.imageContainer}>
        <Image style={previewPlanStyle.image} source={{uri: plan.banner}} resizeMode="cover"/>
      </View>
      <View style={styles.cardContainer}>
        <View style={previewPlanStyle.orgContainer}>
          <Text style={previewPlanStyle.orgText}>{plan.name}</Text>
          <TouchableOpacity onPress={()=>handleLike()}>
            {liked?
            <Ionicons name='heart' color='white'size={25}/>
            :
            <Ionicons name='heart-outline' color={'white'} size={25}/>
            }
          </TouchableOpacity>
        </View>
        {milestonePlan && (
          <View
            style={{ position: 'relative', width: '100%' }}
            onLayout={(event) => {
              const containerWidth = event.nativeEvent.layout.width;
              setParentWidth(containerWidth);
            }}
          >
            <View style={previewPlanStyle.roadmapContainer}>
              <View style={previewPlanStyle.roadmap}>
                {parentWidth && checkpoints &&
                  milestonePlan.map((milestone, index) => (
                    <PointStatus
                      milestone={milestone}
                      index={index}
                      key={index}
                      numMilestones={milestonePlan.length}
                      parentWidth={parentWidth}
                      checkpoints={checkpoints}
                    />
                  ))}
              </View>
            </View>
          </View>
        )}
        {expenditurePlan && (
          <View style={previewPlanStyle.barConatiner}>
              <Text style={previewPlanStyle.text}>{plan.points}</Text>
              <View style={previewPlanStyle.bar}>
                  <View style={[previewPlanStyle.darker, {width:`${Math.round((plan.points/expenditurePlan.expenditure) * 100)}%`}]}/>
              </View>
              <Text style={previewPlanStyle.text}>{expenditurePlan.expenditure}</Text>
          </View>
        )}

      </View>
    </View>
  )
}

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
    height:'100%',
    flex:1,
    paddingVertical:'10%',
    gap:'0%'
  },
  discoverButton:{
    borderRadius:10,
    borderWidth:1.5, 
    borderColor:color_pallete[5],
    alignSelf:'center',
    width:'80%',
    padding:10,
    marginBottom:'5%',
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
  },
  card:{
    alignSelf:'center',
    backgroundColor:'transparent',
    width:'94%',
    borderRadius:10,
  },
  cardContainer:{
    backgroundColor:color_pallete[5],
    justifyContent:'center',
    gap:15,
    padding:8,
    paddingBottom:20,
    borderRadius:10,
        shadowColor:'black',
    shadowOffset:{
      height:3,width:0
    },
    shadowOpacity:0.3,
    shadowRadius:3
  }
});

const previewPlanStyle = StyleSheet.create({
  roadmap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:'80%',
  },
  roadmapContainer:{
    width:'100%',
    alignItems:'center'
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 15,
    backgroundColor: color_pallete[5],
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:-2,
  },
  circleText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  line: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  completion: {
    height: 4,
    backgroundColor: 'white',
  },
  bar:{
    flex:1,
    backgroundColor:color_pallete[6],
    height:14,
    alignSelf:'center',
    borderRadius:3,
    overflow:'hidden'
  },
  barConatiner:{
    flexDirection:'row',
    justifyContent:'center',
    gap:10,
    marginHorizontal:'6%',
  },
  darker:{
    backgroundColor:'white',
    height:'100%',
    position:'absolute',
    left:0
  },
  text:{
    fontFamily:'Avenir Next',
    fontWeight:'500',
    color:'white',
    fontSize:12
  },
  visitContainer:{
    position:'absolute', 
    right:-10, 
    bottom:-7,
    width:18,
    height:18,
    backgroundColor:'white',
    borderRadius:10,
    justifyContent:'center'
  },
  visitText:{
    fontSize:12, 
    fontWeight:'800',
    alignSelf:'center',
    textAlign:'center',
    color:color_pallete[5],
  },
  header:{
    fontSize:18,
    fontWeight:'600',
    fontFamily: 'Avenir Next',
    color:'white'
  },
  imageContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#f0f0f0',
    bottom:-20,
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    overflow:'hidden'
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 2,
    backgroundColor:'gray',
  },
  orgContainer:{
    marginHorizontal:20,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  orgText:{
    fontFamily: 'Avenir Next',
    color:'white',
    fontWeight:'600',
    fontSize:18,
  },
});
