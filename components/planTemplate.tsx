import { Plan, Tier, RewardMapProps } from "@/app-data/data-types";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import Collapsible from "react-native-collapsible";
import {
  dropDown,
  milestoneStyle,
  modalStyle,
} from "@/components/styling/mapPreviewStyle";
import Ionicons from "@expo/vector-icons/Ionicons";
import { color_pallete } from "@/constants/Colors";
import { useState } from "react";
import React from "react";

const { width, height } = Dimensions.get("window");

type RoadMapProps = {
  plan: Plan;
};
type CategorizeProps = {
  road_map: RewardMapProps;
  visits: number;
  redeemableRewards: string[];
};

function getNextRewardVisits(plan: Plan) {
  const { reward_plan, visits } = plan;

  if (!reward_plan || !reward_plan.rewards_loyalty) {
    throw new Error("Invalid reward plan structure");
  }

  const milestones = Object.keys(reward_plan.rewards_loyalty)
    .map(Number)
    .sort((a, b) => a - b);
  for (const milestone of milestones) {
    if (milestone === visits) {
      return milestone - visits;
    } else if (visits < milestone) {
      return milestone - visits;
    }
  }

  return 0;
}

// function anlyzeInput(reward:Reward){
//     if (!reward || !reward.type) {
//         return "Invalid reward";
//       }

//       switch (reward.type) {
//         case "item":
//           if (typeof reward.rule === "number" && reward.rule > 0) {
//             return `Free ${reward.item} with any purchase of +$${reward.rule}`;
//           } else if (typeof reward.rule === "string") {
//             return `Free ${reward.item} with any ${reward.rule}`;
//           }
//           return `Free ${reward.item}`;

//         case "percentage":
//           if (typeof reward.rule === "number" && reward.rule >0) {
//             return `${reward.value}% off any order +$${reward.rule}+`;
//           }
//           else if (typeof reward.rule === "string" && reward.rule !== ''){
//             return `$${reward.value} off any ${reward.rule}`;
//           }
//           return `${reward.value}% off`;

//         case "cost":
//           if (typeof reward.rule === "string") {
//             return `$${reward.value} off any ${reward.rule}`;
//           }
//           else if (typeof reward.rule === "number" && reward.rule >0){
//             return `$${reward.value} with any purchase of +$${reward.rule}`;
//           }
//           return `$${reward.value} off`;

//         default:
//           return "Unknown reward type";
//       }
// }

const categorizeRewards = ({
  road_map,
  visits,
  redeemableRewards,
}: CategorizeProps) => {
  const milestones = Object.keys(road_map)
    .map((key) => Number(key))
    .filter((milestone) => !isNaN(milestone));

  return milestones.map((milestone) => {
    const tier_id = road_map[milestone].id;
    const redeemable = redeemableRewards.includes(tier_id);

    if (milestone <= visits && !redeemable) {
      return {
        milestone,
        status: "passed",
        rewards: road_map[milestone],
        redeemable,
      };
    } else if (redeemable || milestone <= visits) {
      return {
        milestone,
        status: "current",
        rewards: road_map[milestone],
        redeemable,
      };
    } else {
      return {
        milestone,
        status: "upcoming",
        rewards: road_map[milestone],
        redeemable,
      };
    }
  });
};

const ListRewards: React.FC<{
  rewardList: string[];
  option: number;
  redeemable: boolean;
}> = ({ rewardList, option, redeemable }) => {
  return (
    <View>
      {rewardList.map((reward, index) => {
        const rewardOption = reward;
        return (
          <View key={index}>
            {index == 0 && <View style={dropDown.seperaterLine} />}
            <View
              key={index}
              style={
                option == 0
                  ? [
                      dropDown.rewardContainer,
                      { backgroundColor: color_pallete[7] },
                    ]
                  : [dropDown.rewardContainer]
              }
            >
              <Text style={dropDown.rewardText}> {rewardOption}</Text>
              {redeemable ? (
                <TouchableOpacity style={dropDown.redeemBtn}>
                  <Text style={dropDown.redeemText}>Redeem</Text>
                </TouchableOpacity>
              ) : (
                <Ionicons
                  name={"lock-closed-outline"}
                  size={width / 20}
                  color={color_pallete[5]}
                />
              )}
            </View>
            {index < rewardList.length - 1 && (
              <View style={dropDown.seperaterLine} />
            )}
          </View>
        );
      })}
    </View>
  );
};

export const RoadMap: React.FC<RoadMapProps> = ({ plan }) => {
  if (!plan.reward_plan.rewards_loyalty) {
    return null;
  }

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const milestones = Object.entries(plan.reward_plan.rewards_loyalty);
  const lineWidth =
    ((width - milestones.length * 30) / (milestones.length - 1)) * 0.8;
  const tillNextRew = getNextRewardVisits(plan);

  const taggedRewards = categorizeRewards({
    road_map: plan.reward_plan.rewards_loyalty,
    visits: plan.visits,
    redeemableRewards: plan.redeemableRewards,
  });
  const checkpoints = milestones.map(([checkpoint]) =>
    parseInt(checkpoint, 10)
  );

  const PointStatus: React.FC<{ milestone: [string, Tier]; index: number }> = ({
    milestone,
    index,
  }) => {
    const rewardRedeemable = plan.redeemableRewards.includes(milestone[1].id);
    const checkpoint = parseInt(milestone[0], 10);
    const prevCheckpoint = checkpoints
      .filter((findCheckpoint: number) => findCheckpoint < checkpoint)
      .pop();

    const completion = prevCheckpoint
      ? plan.visits < prevCheckpoint
        ? 0
        : plan.visits >= checkpoint
        ? 1
        : (plan.visits % checkpoint) / checkpoint
      : 0;

    return (
      <View key={index} style={modalStyle.stepContainer}>
        {index > 0 && (
          <View style={[modalStyle.line, { width: lineWidth + 2 }]}>
            <View
              style={[
                modalStyle.completion,
                {
                  width: lineWidth * completion,
                  position: "absolute",
                  height: "100%",
                },
                completion != 1
                  ? { borderTopRightRadius: 4, borderBottomRightRadius: 4 }
                  : null,
              ]}
            />
          </View>
        )}
        {plan.visits >= checkpoint && !rewardRedeemable ? (
          <View
            style={[modalStyle.circle, { backgroundColor: color_pallete[2] }]}
          >
            <Ionicons name="checkmark" color="white" />
          </View>
        ) : rewardRedeemable ? (
          <View
            style={[modalStyle.circle, { backgroundColor: color_pallete[3] }]}
          >
            <Ionicons name="star" color={"white"} />
          </View>
        ) : (
          <View style={[modalStyle.circle]}>
            <Text style={modalStyle.circleText}>{checkpoint}</Text>
          </View>
        )}
      </View>
    );
  };

  const StatusText = () => {
    if (!plan.activePlan && plan.firstPlan) {
      return <Text style={modalStyle.visitsText}>Start Your Plan now!</Text>;
    }
    return (
      <Text style={modalStyle.visitsText}>
        {tillNextRew && tillNextRew > 0
          ? `${tillNextRew} ${
              tillNextRew === 1 ? "Visit" : "Visits"
            } until your next reward!`
          : `Redeem a reward on your next visit!`}
      </Text>
    );
  };

  return (
    <View style={{ gap: 30, marginBottom: height / 10 }}>
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <StatusText />
      </View>
      {/* roadMap Bar */}
      <View style={modalStyle.roadmapContainer}>
        <View style={modalStyle.roadmap}>
          {milestones.map((milestone, index) => (
            <PointStatus milestone={milestone} index={index} key={index} />
          ))}
        </View>
      </View>
      {/* Drop Down */}
      <View style={[modalStyle.roadmapContainer, { marginTop: 10 }]}>
        <Animated.View style={dropDown.container}>
          {taggedRewards.map(({ status, rewards, redeemable }, index) => (
            <React.Fragment key={index}>
              {status === "passed" && (
                <TouchableOpacity
                  activeOpacity={1}
                  style={[
                    dropDown.tierTitleContainer,
                    { backgroundColor: color_pallete[6] },
                  ]}
                >
                  <View>
                    <Text
                      style={[dropDown.subText1, { color: color_pallete[5] }]}
                    >{`Tier ${index + 1} Rewards`}</Text>
                  </View>
                  <Ionicons
                    name={"checkmark"}
                    size={width / 20}
                    color={color_pallete[5]}
                  />
                </TouchableOpacity>
              )}
              {status === "current" && (
                <View style={dropDown.tierContainer}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={[
                      dropDown.tierTitleContainer,
                      { backgroundColor: color_pallete[5] },
                    ]}
                    onPress={() => {
                      selectedIndex == index
                        ? setSelectedIndex(-1)
                        : setSelectedIndex(index);
                    }}
                  >
                    <View>
                      <Text
                        style={[dropDown.subText1, { color: "white" }]}
                      >{`Tier ${index + 1} Rewards`}</Text>
                    </View>
                    <Ionicons
                      name={
                        selectedIndex == index ? "chevron-up" : "chevron-down"
                      }
                      size={width / 20}
                      color={"white"}
                    />
                  </TouchableOpacity>
                  <Collapsible collapsed={selectedIndex !== index}>
                    <ListRewards
                      rewardList={rewards.rewards}
                      option={0}
                      redeemable={redeemable}
                    />
                  </Collapsible>
                </View>
              )}
              {status === "upcoming" && (
                <View style={dropDown.tierContainer}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={[dropDown.tierTitleContainer]}
                    onPress={() => {
                      selectedIndex == index
                        ? setSelectedIndex(-1)
                        : setSelectedIndex(index);
                    }}
                  >
                    <View>
                      <Text
                        style={[dropDown.subText1, { color: color_pallete[5] }]}
                      >{`Tier ${index + 1} Rewards`}</Text>
                    </View>
                    <Ionicons
                      name={"lock-closed-outline"}
                      size={width / 20}
                      color={color_pallete[5]}
                    />
                  </TouchableOpacity>
                  <Collapsible collapsed={selectedIndex !== index}>
                    <ListRewards
                      rewardList={rewards.rewards}
                      option={1}
                      redeemable={redeemable}
                    />
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

export const ExpendatureMap: React.FC<RoadMapProps> = ({ plan }) => {
  if (!plan.reward_plan.rewards_milestone) {
    return null;
  }

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  let dark_ratio = Math.round(
    (plan.points / plan.reward_plan.rewards_milestone.expenditure) * 100
  );
  let pointsTill = plan.reward_plan.rewards_milestone.expenditure - plan.points;
  let points = plan.points;

  if (dark_ratio === 0 && plan.firstPlan) {
    pointsTill = plan.reward_plan.rewards_milestone.expenditure - 50;
    dark_ratio = Math.round(
      (50 / plan.reward_plan.rewards_milestone.expenditure) * 100
    );
    points = 50;
  }

  return (
    <View>
      <View
        style={{ alignItems: "center", marginVertical: 10, marginBottom: 20 }}
      >
        {plan.firstPlan && (
          <Text style={modalStyle.visitsText}>
            Get 50 points on us with your first plan!
          </Text>
        )}
        {pointsTill > 0 ? (
          <Text
            style={
              plan.firstPlan
                ? milestoneStyle.visitsText2
                : modalStyle.visitsText
            }
          >
            {pointsTill} points until you unlock Rewards!
          </Text>
        ) : (
          <Text
            style={
              plan.firstPlan
                ? milestoneStyle.visitsText2
                : modalStyle.visitsText
            }
          >
            Unlock a Reward Now!
          </Text>
        )}
      </View>
      {/* Completion Bar */}
      <View style={milestoneStyle.barConatiner}>
        <Text style={milestoneStyle.text}>{points}</Text>
        <View style={milestoneStyle.bar}>
          <View style={[milestoneStyle.darker, { width: `${dark_ratio}%` }]} />
        </View>
        <Text style={milestoneStyle.text}>
          {plan.reward_plan.rewards_milestone.expenditure}
        </Text>
      </View>
      {/* Drop Down */}
      <View style={[modalStyle.roadmapContainer, { marginTop: 10 }]}>
        <Animated.View style={dropDown.container}>
          <View style={dropDown.tierContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                dropDown.tierTitleContainer,
                { backgroundColor: color_pallete[5] },
              ]}
              onPress={() => {
                selectedIndex == 1 ? setSelectedIndex(0) : setSelectedIndex(1);
              }}
            >
              <View>
                <Text
                  style={[dropDown.subText1, { color: "white" }]}
                >{`View Milestone Reward options`}</Text>
              </View>
              <Ionicons
                name={selectedIndex == 1 ? "chevron-up" : "chevron-down"}
                size={width / 20}
                color={"white"}
              />
            </TouchableOpacity>
            <Collapsible collapsed={selectedIndex !== 1}>
              <ListRewards
                rewardList={plan.reward_plan.rewards_milestone.rewardsOptions}
                option={0}
                redeemable={
                  plan.points >= plan.reward_plan.rewards_milestone.expenditure
                }
              />
            </Collapsible>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};
