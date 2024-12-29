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
  preview:string;
  name:string;
  latitude: number;
  longitude: number;
  liked:boolean;
  location:{
    city:string,
    state:string
  }
  shop_hours: ShopHour[];
}

export interface shop {
  id: string; 
  organization_id: string; 
  location_id: string;
  geohash: string;
  banner: string;
  logo:string;
  liked:boolean;
  menu:string|undefined;
  phoneNumber:string;
  description:string
}

export interface Profile {
  id: string;
  username: string;
  role: "customer" | "admin" | "owner";
  first_name: string;
  last_name: string;
  dob: Date;
  preferences: {
    theme: "dark" | "light";
  };
  date_registered: string;
}

export type Reward = {
  type: 'cost'|'percentage'|'item'; 
  value?: number; 
  item?: string;
  rule?: string|number;
};

export interface Tier {
  id: string;
  rewards: Reward[];
}

export interface ExpentiureProps {
  expenditure: number;
  rewardsOptions: Reward[];
};

export interface RewardMapProps{
  [tier: number]: Tier;
};

export interface RewardSystem {
  road_map?: RewardMapProps
  exp_rewards?: ExpentiureProps
}

export interface Plan{
  reward_plan:RewardSystem,
  visits:number,
  points:number,
  organization_id:string
  reward_planAvail:boolean,
  exp_rewardsAvail:boolean,
  name:string,
  firstPlan:boolean,
  activePlan:boolean,
  redeemableRewards:string[],
  id?:string
}

export interface PlanPreviewProps extends Plan{
  liked:boolean
}