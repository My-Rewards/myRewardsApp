import { Timestamp } from "react-native-reanimated/lib/typescript/reanimated2/commonTypes";

export interface regionProp {    
        latitude: number,
        longitude: number,
        latitudeDelta: number,
        longitudeDelta: number
    }
    
export interface ShopHour {
    day: string;
    open: string | null;
    close: string | null;
  }
  
  export interface shopPreview {
    id: string; 
    organization_id: string; 
    location_id: string;
    logo:string;
    name:string;
    description:string;
    geohash: string;
    latitude: number;
    longitude: number;
  }

  export interface shop {
    id: string; 
    organization_id: string; 
    location_id: string;
    geohash: string;
    latitude: number;
    longitude: number;
    shop_hours: ShopHour[];
    description: string; 
    title: string; 
    logo: string; 
    banner: string;
  }

  export interface Profile {
    id: string;
    username: string;
    role: "customer" | "admin" | "owner";
    first_name: string;
    last_name: string;
    dob: Timestamp;
    preferences: {
      theme: "dark" | "light";
    };
    date_registered: string;
  }
  
  export type Reward = {
    type: 'cost'|'percentage'; 
    value: number; 
  };

  export interface RewardSystem {
    road_map: {
      [milestone: string]: Reward[];
    };
    exp_rewards: {
      expenditure: string;
      rewardsOptions: Reward[];
    };
  }

  export interface Plan{
    reward_plan:RewardSystem,
    visits:number,
    spent:number,
    organization_id:string
    name:string,
    id:string
  }