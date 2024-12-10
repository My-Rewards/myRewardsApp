import { Plan } from "@/app-data/data-types";
import { View, Text, Dimensions } from "react-native"
import Collapsible from 'react-native-collapsible';
import {modalStyle, styles} from './mapPreviewStyle'
import Ionicons from '@expo/vector-icons/Ionicons';
import { color_pallete } from "@/constants/Colors";
import { useState } from "react";

const { width } = Dimensions.get('window');

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

export const roadMap = (plan:Plan) => {
    const milestones = Object.entries(plan.reward_plan.road_map);
    const lineWidth = ((width - milestones.length * 30) / (milestones.length - 1))*0.8;
    const tillNextRew = getNextRewardVisits(plan);

    let selectedIndex = -1;


    return(
        <View>
              <View style={{alignItems:'center', margin:20}}>
                <Text style={modalStyle.visitsText}>{tillNextRew} {tillNextRew === 1?'Visit':'Visits'} until your next reward!</Text>
              </View>
              <View style={modalStyle.roadmapContainer}>
                <View style={modalStyle.roadmap}>
                  {milestones.map(([milestone], index) => (
                    <View key={milestone} style={modalStyle.stepContainer}>
                      {plan.visits.toString() > milestone ? (
                      <View style={[modalStyle.circle, {backgroundColor:color_pallete[2]}]}>
                        <Ionicons name='checkmark' color={'white'}/>
                      </View>
                      ):(
                      <View style={[modalStyle.circle]}>
                        <Text style={modalStyle.circleText}>{milestone}</Text>
                      </View>
                      )}
                      {index < milestones.length - 1 && <View style={[modalStyle.line, { width: lineWidth }]} />}
                    </View>
                  ))}
                </View>
                <View>
                    <View>
                        {milestones.map(([milestone, rewards], index) => {
                            const numMileStone = parseInt(milestone, 10);
                            return(
                                <Collapsible collapsed={!(selectedIndex == index)} key={index}>
                                    {rewards.map((reward, index) => {
                                        return(
                                            <View key={index}>
                                                <Text>{reward.type}</Text>
                                            </View>
                                        )
                                    })}
                                </Collapsible>
                            )
                        })}
                    </View>
                </View>
              </View>
        </View>
    )
}

export const expendatureMap = (plan:Plan) => {

    return(
        <View>

        </View>
    )
}