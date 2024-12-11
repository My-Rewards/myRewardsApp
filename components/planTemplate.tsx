import { Plan, Reward } from "@/app-data/data-types";
import { View, Text, Dimensions, TouchableOpacity, Animated, SafeAreaView } from "react-native"
import Collapsible from 'react-native-collapsible';
import {dropDown, milestoneStyle, modalStyle, styles} from './mapPreviewStyle'
import Ionicons from '@expo/vector-icons/Ionicons';
import { color_pallete } from "@/constants/Colors";
import { useState } from "react";
import React from "react";

const { width, height } = Dimensions.get('window');

type RoadMapProps = {
    plan: Plan;
  };

function getNextRewardVisits(data:Plan) {
    const { reward_plan, visits } = data;
  
    if (!reward_plan || !reward_plan.road_map) {
      throw new Error("Invalid reward plan structure");
    }
  
    const milestones = Object.keys(reward_plan.road_map)
      .map(Number)
      .sort((a, b) => a - b);
      for (const milestone of milestones) {
      if (visits < milestone) {
        return milestone - visits;
      }
    }
    
    return null;
}

function anlyzeInput(reward:Reward){
    if (!reward || !reward.type) {
        return "Invalid reward";
      }
    
      switch (reward.type) {
        case "item":
          if (typeof reward.rule === "number" && reward.rule > 0) {
            return `Free ${reward.item} with any purchase of +$${reward.rule}`;
          } else if (typeof reward.rule === "string") {
            return `Free ${reward.item} with any ${reward.rule}`;
          }
          return `Free ${reward.item}`;
    
        case "percentage":
          if (typeof reward.rule === "number" && reward.rule >0) {
            return `${reward.value}% off any order +$${reward.rule}+`;
          }
          else if (typeof reward.rule === "string" && reward.rule !== ''){
            return `$${reward.value} off any ${reward.rule}`;
          }
          return `${reward.value}% off`;
    
        case "cost":
          if (typeof reward.rule === "string") {
            return `$${reward.value} off any ${reward.rule}`;
          }
          else if (typeof reward.rule === "number" && reward.rule >0){
            return `$${reward.value} with any purchase of +$${reward.rule}`;
          }
          return `$${reward.value} off`;
    
        default:
          return "Unknown reward type";
      }
}

const categorizeRewards = (plan: Plan) => {
    const { road_map } = plan.reward_plan;
    const visits = plan.visits;
  
    const milestones = Object.keys(road_map).map(Number).sort((a, b) => a - b);
  
    return milestones.map((milestone) => {
      if (milestone <= visits) {
        return { milestone, status: "passed", rewards: road_map[milestone] };
      } else if (milestone === Math.min(...milestones.filter((m) => m > visits))) {
        return { milestone, status: "current", rewards: road_map[milestone] };
      } else {
        return { milestone, status: "upcoming", rewards: road_map[milestone] };
      }
    });
};

const ListRewards: React.FC<{rewards:Reward[], option:number}> = ({rewards, option}) =>{
    return(
        <View>
            {rewards.map((reward, index) => {
                const rewardOption = anlyzeInput(reward);
                return(
                    <View key={index}>
                        {index == 0 && (
                            <View style={dropDown.seperaterLine} />
                        )}   
                        <View key={index} 
                        style={option==0?[dropDown.rewardContainer, {backgroundColor:color_pallete[7]}]:[dropDown.rewardContainer]}>
                            <Text style={dropDown.rewardText}> {rewardOption}</Text>
                        </View>
                        {index < rewards.length - 1 && (
                            <View style={dropDown.seperaterLine} />
                        )}                 
                    </View>
                )
            })}
        </View>
    )
}

export const RoadMap: React.FC<RoadMapProps> = ({ plan }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [focal, setFocal] = useState<boolean>(false);

    const milestones = Object.entries(plan.reward_plan.road_map);
    const lineWidth = ((width - milestones.length * 30) / (milestones.length - 1)) * 0.8;
    const tillNextRew = getNextRewardVisits(plan);

    const taggedRewards = categorizeRewards(plan);

    return (
        <View style={{gap:30, marginBottom:height/10}}>
            <View style={{ alignItems: 'center', marginTop:10}}>
                <Text style={modalStyle.visitsText}>
                    {tillNextRew && tillNextRew>0 ?
                    `${tillNextRew} ${tillNextRew === 1 ? 'Visit' : 'Visits'} until your next reward!`
                    :
                    `Redeem a reward on your next visit`
                    }
                </Text>
            </View>
            <View style={modalStyle.roadmapContainer}>
                <View style={modalStyle.roadmap}>
                    {milestones.map(([milestone], index) => (
                        <View key={milestone} style={modalStyle.stepContainer}>
                        {plan.visits >= parseInt(milestone,10) ? (
                            <View style={[modalStyle.circle, { backgroundColor: color_pallete[2] }]}>
                                <Ionicons name="checkmark" color="white" />
                            </View>
                        ) : (
                            <View style={[modalStyle.circle]}>
                                <Text style={modalStyle.circleText}>{milestone}</Text>
                            </View>
                        )}
                        {index < milestones.length - 1 && (
                            <View style={[modalStyle.line, { width: lineWidth }]} />
                        )}
                        </View>
                    ))}
                </View>
            </View>
            <View style={[modalStyle.roadmapContainer, {marginTop:10}]}>
                <Animated.View style={dropDown.container}>
                        {taggedRewards.map(({ status, rewards }, index) => (
                            <React.Fragment key={index}>
                            {status === 'passed' && (
                                <TouchableOpacity activeOpacity={1} style={[dropDown.tierTitleContainer, {backgroundColor:color_pallete[6]}]}>
                                    <View>
                                        <Text style={[dropDown.subText1, {color:color_pallete[5]}]}>{`Tier ${index + 1} Rewards`}</Text>
                                    </View>
                                    <Ionicons name={'checkmark'} size={width/20} color={color_pallete[5]}/>
                                </TouchableOpacity>
                            )}
                            {status === 'current' && (
                                <View style={dropDown.tierContainer}>
                                    <TouchableOpacity 
                                        activeOpacity={1}
                                        style={[dropDown.tierTitleContainer, {backgroundColor:color_pallete[5]}]} 
                                        onPress={()=>{selectedIndex==index ? setSelectedIndex(-1):setSelectedIndex(index)}}
                                    >
                                        <View>
                                            <Text style={[dropDown.subText1, {color:'white'}]}>{`Tier ${index + 1} Rewards`}</Text>
                                        </View>
                                        <Ionicons name={selectedIndex == index?'chevron-up':'chevron-down'} size={width/20} color={'white'}/>
                                    </TouchableOpacity>
                                    <Collapsible collapsed={selectedIndex !== index}>
                                        <ListRewards rewards={rewards} option={0} />
                                    </Collapsible>
                                </View>
                            )}
                            {status === 'upcoming' && (
                                <View style={dropDown.tierContainer}>
                                    <TouchableOpacity 
                                        activeOpacity={1}
                                        style={[dropDown.tierTitleContainer]} 
                                        onPress={()=>{selectedIndex==index ? setSelectedIndex(-1):setSelectedIndex(index)}}
                                    >
                                        <View>
                                            <Text style={[dropDown.subText1, {color:color_pallete[5]}]}>{`Tier ${index + 1} Rewards`}</Text>
                                        </View>
                                        <Ionicons name={'lock-closed-outline'} size={width/20} color={color_pallete[5]}/>
                                    </TouchableOpacity>
                                    <Collapsible collapsed={selectedIndex !== index}>
                                        <ListRewards rewards={rewards} option={1}/>
                                    </Collapsible>
                                </View>
                            )}
                            {index < taggedRewards.length - 1 && (
                                <View style={dropDown.seperaterLine} />
                            )}
                            </React.Fragment>
                        ))}
                </Animated.View>
            </View>
        </View>
    );
};

export const ExpendatureMap:React.FC<RoadMapProps> = ({plan}) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    let dark_ratio =  Math.round((plan.points/plan.reward_plan.exp_rewards.expenditure) * 100);
    let pointsTill = plan.reward_plan.exp_rewards.expenditure-plan.points;
    let points = plan.points;

    if(dark_ratio === 0 && plan.firstPlan){
        pointsTill = plan.reward_plan.exp_rewards.expenditure-50;
        dark_ratio = Math.round((50/plan.reward_plan.exp_rewards.expenditure) * 100);
        points = 50
    }

    return(
        <View>
            <View style={{ alignItems: 'center', marginVertical:10}}>
                {plan.firstPlan && 
                    <Text style={modalStyle.visitsText}>
                        Get 50 points on us with your first plan!
                    </Text>
                }
                <Text style={plan.firstPlan ? milestoneStyle.visitsText2 : modalStyle.visitsText}>
                    {pointsTill} points until you unlock Rewards!
                </Text>
            </View>
            <View style={milestoneStyle.barConatiner}>
                <Text style={milestoneStyle.text}>{points}</Text>
                <View style={milestoneStyle.bar}>
                    <View style={[milestoneStyle.darker, {width:`${dark_ratio}%`}]}/>
                </View>
                <Text style={milestoneStyle.text}>{plan.reward_plan.exp_rewards.expenditure}</Text>
            </View>
            <View style={[modalStyle.roadmapContainer, {marginTop:10}]}>
                <Animated.View style={dropDown.container}>
                    <View style={dropDown.tierContainer}>
                        <TouchableOpacity 
                            activeOpacity={1}
                            style={[dropDown.tierTitleContainer, {backgroundColor:color_pallete[5]}]} 
                            onPress={()=>{selectedIndex==1 ? setSelectedIndex(0):setSelectedIndex(1)}}
                        >
                            <View>
                                <Text style={[dropDown.subText1, {color:'white'}]}>{`View Milestone Reward options`}</Text>
                            </View>
                            <Ionicons name={selectedIndex == 1?'chevron-up':'chevron-down'} size={width/20} color={'white'}/>
                        </TouchableOpacity>
                        <Collapsible collapsed={selectedIndex !== 1}>
                            <ListRewards rewards={plan.reward_plan.exp_rewards.rewardsOptions} option={0} />
                        </Collapsible>
                    </View>
                </Animated.View>
            </View>
        </View>
    )
}