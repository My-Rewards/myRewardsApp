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
  org_id: string;
  shop_id: string;
  preview:string;
  name:string;
  latitude: number;
  longitude: number;
  distance: number;
  favorite:boolean;
  location:{
    city:string,
    address: string,
    state:string
  }
  shop_hours: ShopHour[]
}

export interface OrganizationProps{
  name: string;
  description:string;
  banner: string;
  logo: string;
}

export interface shop {
  id: string;
  org_id: string;
  name:string;
  banner: string;
  preview:string;
  logo:string;
  favorite:boolean;
  menu:string|undefined;
  phone_number:string;
  description:string;
  shop_hours: ShopHour[];
  location:{
    city:string,
    state:string,
    address:string
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

export interface Tier {
  id: string;
  rewards: string[];
}

export interface ExpentiureProps {
  expenditure: number;
  id: string;
  rewards: string[];
};

export interface RewardMapProps{
  tierStep: number,
  rewards: {
    [tier: number]: Tier;
  }
};

export interface RewardSystem {
  rewards_loyalty?: RewardMapProps
  rewards_milestone?: ExpentiureProps
}

export interface RewardProp{
  id:string,
  reward_id:string
}

export interface Plan{
  id:string,
  reward_plan:RewardSystem,
  visits:number,
  points:number,
  org_id:string
  rl_active:boolean,
  rm_active:boolean,
  firstPlan:boolean,
  active:boolean,
  redeemableRewards:RewardProp[],
}

export interface PlanProps{
  id:string,
  shop_id:string;
  reward_plan:RewardSystem,
  visits:number,
  points:number,
  org_id:string
  rl_active:boolean,
  rm_active:boolean,
  name:string,
  firstPlan:boolean,
  activePlan:boolean,
  redeemableRewards:RewardProp[] | undefined,
  active:boolean,
  favorite:boolean,
}

export interface PreviewPlanProp extends PlanProps{
  banner: string,
  logo:string
  activeRewards:boolean;
}

export interface AppConfig { 
  CUSTOMER_GET_ENDPOINT: string;
  CUSTOMER_UPDATE_ENDPOINT: string;
  CUSTOMER_DELETE_ENDPOINT: string;
}

export interface mapPinProps {
  id: string;
  longitude: number;
  latitude: number;
}