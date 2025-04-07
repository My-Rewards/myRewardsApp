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

export interface ShopPreviewProps {
  id: string; 
  organization_id: string; 
  shop_id: string;
  preview:string;
  name:string;
  latitude: number;
  longitude: number;
  favorite:boolean;
  location:{
    city:string,
    state:string
  }
  shop_hours: ShopHour[];
}

export interface OrganizationProps{
  name: string;
  description:string;
  banner: string;
  logo: string;
}

export interface shop {
  shop_id: string; 
  organization_id: string; 
  location_id: string;
  geohash: string;
  name:string;
  banner: string;
  logo:string;
  favorite:boolean;
  menu:string|undefined;
  phoneNumber:string;
  description:string;
  shop_hours: ShopHour[];
  location:{
    city:string,
    state:string
  };
  latitude: number;
  longitude: number;
}

export type Profile = {
  credentials?: {
    modifyPlans: boolean;
    modifyPayments: boolean;
  };
  birthdate?: Date | null;
  role?: string;
  newAccount?: boolean;
  preferences?: {
    lightMode: boolean;
  };
  date_created?: Date | null;
  id?: string;
  email?: string;
  fullname?: {
    firstName?: string;
    lastName?: string;
  };
};

export type Reward = {
  // type: 'cost'|'percentage'|'item'; 
  // value?: number; 
  // item?: string;
  // rule: string|number;
  // bonusReward?: string;
 reward: string;
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
  id:string,
  reward_plan:RewardSystem,
  visits:number,
  points:number,
  organization_id:string
  reward_planAvail:boolean,
  exp_rewardsAvail:boolean,
  firstPlan:boolean,
  activePlan:boolean,
  redeemableRewards:string[],
  bonusRewards?: Reward[],
}

export interface PlanProps{
  id:string,
  reward_plan:RewardSystem,
  visits:number,
  points:number,
  organization_id:string
  shop_id: string,
  favorite:boolean,
  reward_planAvail:boolean,
  exp_rewardsAvail:boolean,
  name:string,
  firstPlan:boolean,
  activePlan:boolean,
  redeemableRewards:string[],
  bonusRewards?: Reward[],
}

export interface PreviewPlanProp extends PlanProps{
  banner: string,
  logo:string
}

export type AppConfig = { 
  CUSTOMER_GET_ENDPOINT: string;
  CUSTOMER_UPDATE_ENDPOINT: string;
  CUSTOMER_DELETE_ENDPOINT: string;
}