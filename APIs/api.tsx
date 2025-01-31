import { OrganizationProps, PlanProps, PreviewPlanProp, Profile, RewardSystem, shop, ShopPreviewProps } from "@/app-data/data-types";

// These functions are intended to mock the API outputs with a mock Delay for frontend 
// Development while the real APIs are being created

// When APIS are ready create them here then replace the mock with the real APIs

// This will serve as mock data for consistency
const shopIds=[
  'shopabc',
  'shop123',
  'shopa1',
  'shopb2'
]

const shopNames=[
  'Los Tacos',
  'La Granja',
  'Beta Breaky',
  'Tam Tams'
]

const orgDescription = [
  'Fresh, Handmade mexican tacos with our signature loco sauce.',
  'Authentic mexican cuisine, with a hint of italian inspiration.',
  'Fresh and healthy breakfasts for those mindful of nutrition.',
  'Chinese buffet, family run for the past 20 years.'
]

const organizationIds=[
  'orgabc',
  'org123',
  'orga1',
  'orgb2'
]

const rewardTemplates:RewardSystem[]=[
  {
    road_map: {
      1: {
        id: "tier-1",
        rewards: [
          { type: "cost", value: 5, rule: "menu Item" },
          { type: "percentage", value: 10, rule: 0 },
          { type: "percentage", value: 20, rule: "meal" },
        ],
      },
      4: {
        id: "tier-2",
        rewards: [
          { type: "cost", value: 5, rule: 0 },
          { type: "percentage", value: 20, rule: "entree" },
          { type: "item", item: "appetizer", rule: "meal" },
        ],
      },
      8: {
        id: "tier-3",
        rewards: [
          { type: "cost", value: 15, rule: "menu Item" },
          { type: "percentage", value: 25, rule: "menu Item" },
          { type: "item", item: "entree", rule: 0 },
        ],
      },
    },
    exp_rewards: {
      expenditure: 100,
      rewardsOptions: [
        { type: "cost", value: 20, rule:'menu Item' },
        { type: "percentage", value: 50, rule:'menu Item' },
        { type: "item", item: 'entree', rule:0},
      ]
    }
  },
  {
    road_map: {
      3: {
        id: "tier-1",
        rewards: [
          { type: "cost", value: 5, rule: "menu Item" },
          { type: "percentage", value: 10, rule: 0 },
          { type: "percentage", value: 20, rule: "meal" },
        ],
      },
      6: {
        id: "tier-2",
        rewards: [
          { type: "cost", value: 5, rule: 0 },
          { type: "percentage", value: 20, rule: "entree" },
          { type: "item", item: "appetizer", rule: "meal" },
        ],
      },
      9: {
        id: "tier-3",
        rewards: [
          { type: "cost", value: 15, rule: "menu Item" },
          { type: "percentage", value: 25, rule: "menu Item" },
          { type: "item", item: "entree", rule: 0 },
        ],
      },
    },
    exp_rewards: {
      expenditure: 150,
      rewardsOptions: [
        { type: "cost", value: 20, rule:'menu Item' },
        { type: "percentage", value: 50, rule:'menu Item' },
        { type: "item", item: 'entree', rule:0},
      ]
    }
  },
  {
    road_map: {
      3: {
        id: "tier-1",
        rewards: [
          { type: "cost", value: 5, rule: "menu Item" },
          { type: "percentage", value: 10, rule: 0 },
          { type: "percentage", value: 20, rule: "meal" },
        ],
      },
      6: {
        id: "tier-2",
        rewards: [
          { type: "cost", value: 5, rule: 0 },
          { type: "percentage", value: 20, rule: "entree" },
          { type: "item", item: "appetizer", rule: "meal" },
        ],
      },
      9: {
        id: "tier-3",
        rewards: [
          { type: "cost", value: 15, rule: "menu Item" },
          { type: "percentage", value: 25, rule: "menu Item" },
          { type: "item", item: "entree", rule: 0 },
        ],
      },
    },
      exp_rewards: {
        expenditure: 150,
        rewardsOptions: [
          { type: "cost", value: 20, rule:'menu Item' },
          { type: "percentage", value: 50, rule:'menu Item' },
          { type: "item", item: 'entree', rule:0},
        ]
      }
  },
  {
    road_map: {
      3: {
        id: "tier-1",
        rewards: [
          { type: "cost", value: 5, rule: "menu Item" },
          { type: "percentage", value: 10, rule: 0 },
          { type: "percentage", value: 20, rule: "meal" },
        ],
      },
      6: {
        id: "tier-2",
        rewards: [
          { type: "cost", value: 5, rule: 0 },
          { type: "percentage", value: 20, rule: "entree" },
          { type: "item", item: "appetizer", rule: "meal" },
        ],
      },
      9: {
        id: "tier-3",
        rewards: [
          { type: "cost", value: 15, rule: "menu Item" },
          { type: "percentage", value: 25, rule: "menu Item" },
          { type: "item", item: "entree", rule: 0 },
        ],
      },
    },
      exp_rewards: {
        expenditure: 150,
        rewardsOptions: [
          { type: "cost", value: 20, rule:'menu Item' },
          { type: "percentage", value: 50, rule:'menu Item' },
          { type: "item", item: 'entree', rule:0},
        ]
      }
  },
]

const visits=[0,5,8,3]

const points=[0,200,100,20]

export const mockShop = (shop_id:string, user_id:string): Promise<shop> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if(shop_id === shopIds[0]){
        resolve({
          organization_id: organizationIds[0],
          shop_id,
          latitude: 29.6542,
          longitude: -82.3351,
          name: shopNames[0],
          location_id: "loc789",
          geohash: "dr5regw3n",
          banner: "https://picsum.photos/300/200",
          logo: 'https://picsum.photos/200',
          menu:undefined,
          phoneNumber:'5614455304',
          description:orgDescription[0],
          favorite:true,
          location: {
            city: 'Gainesville',
            state: 'Florida'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: null, close: null },
          ],
        });
      }else if (shop_id === shopIds[1]){
        resolve({
          organization_id: organizationIds[1],
          latitude: 29.6478,
          longitude: -82.3173,
          name: shopNames[1],
          shop_id,
          location_id: "loc789",
          geohash: "dr5regw3n",
          menu:'https://www.mock-menu-link.com',
          phoneNumber:'5614936645',
          banner: "https://picsum.photos/300/200",
          logo: 'https://picsum.photos/200',
          description:orgDescription[1],
          favorite:false,
          location: {
            city: 'Gainesville',
            state: 'Florida'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: null, close: null },
          ],
        });
      }else if(shop_id === shopIds[2]){
        resolve({
          organization_id: organizationIds[2],
          name: shopNames[2],
          shop_id,
          latitude: 29.6569,
          longitude: -82.3214,
          location_id: "loc789",
          geohash: "dr5regw3n",
          menu:'https://www.mock-menu-link.com',
          phoneNumber:'5612331223',
          banner: "https://picsum.photos/300/200",
          logo: 'https://picsum.photos/200',
          description:orgDescription[2],
          favorite:false,
          location: {
            city: 'Gainesville',
            state: 'Florida'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: null, close: null },
          ],
        });
      }else{
        resolve({
          organization_id: organizationIds[3],
          name: shopNames[3],
          shop_id,
          latitude: 29.6569,
          longitude: -82.3214,
          location_id: "loc789",
          geohash: "dr5regw3n",
          menu:'https://www.mock-menu-link.com',
          phoneNumber:'5612331223',
          banner: "https://picsum.photos/300/200",
          logo: 'https://picsum.photos/200',
          description:orgDescription[3],
          favorite:false,
          location: {
            city: 'Gainesville',
            state: 'Florida'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: null, close: null },
          ],
        });
      }
    }, 500);
  });
};

export const mockShopRadius = (user_id: string): Promise<ShopPreviewProps[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleShops: ShopPreviewProps[] = [
        {
          latitude: 29.6542,
          longitude: -82.3351,
          preview: 'https://picsum.photos/300',
          organization_id: organizationIds[0],
          shop_id: shopIds[0],
          id: '24hHsk345m',
          name: shopNames[0],
          favorite: true,
          location: {
            city: 'Gainesville',
            state: 'Florida'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: null, close: null },
          ],
        },
        {
          latitude: 29.6478,
          longitude: -82.3173,
          preview: 'https://picsum.photos/200',
          organization_id: organizationIds[1],
          shop_id: shopIds[1],
          id: '24hHsk346m',
          name: shopNames[1],
          favorite: false,
          location: {
            city: 'Gainesville',
            state: 'Florida'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: null, close: null },
          ],
        },
        {
          latitude: 29.6569,
          longitude: -82.3214,
          organization_id: organizationIds[2],
          shop_id: shopIds[2],
          name: shopNames[2],
          preview: 'https://picsum.photos/200',
          id: 'wjn4Sj320B',
          favorite: false,
          location: {
            city: 'Gainesville',
            state: 'Florida'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: null, close: null },
          ],
        },
        {
          latitude: 29.6501,
          longitude: -82.3305,
          preview: 'https://picsum.photos/200',
          organization_id: organizationIds[3],
          shop_id: shopIds[3],
          id: 'ien5J2k2',
          name: shopNames[3],
          favorite: false,
          location: {
            city: 'Gainesville',
            state: 'Florida'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: null, close: null },
          ],
        }
      ];
      resolve(sampleShops);
    }, 1000);
  });
};

export const mockProfile = (user_id:string): Promise<Profile> => {
  return new Promise((resolve) => {
      setTimeout(() => {
        const sampleProfile: Profile = {
          id: "A34ghjw",
          username: "email@example.com",
          role: "customer",
          first_name: "John",
          last_name: "Howil",
          dob: new Date('2002-05-12'),
          preferences: {
            theme: "dark",
          },
          date_registered: "2024-01-01",
        };
        resolve(sampleProfile);
      }, 500);
    });
}

export const mockPlans = (user_id:string): Promise<PreviewPlanProp[]> => {
  return new Promise((resolve) => {
      setTimeout(() => {
        const samplePlans: PreviewPlanProp[] = [
          {
            reward_plan: rewardTemplates[0],
            visits: visits[0],
            points: points[0],
            redeemableRewards:[],
            reward_planAvail:true,
            exp_rewardsAvail:false,
            banner: "https://picsum.photos/300/200",
            logo: "https://picsum.photos/300/200",
            organization_id: organizationIds[0],
            shop_id:shopIds[0],
            name:shopNames[0],
            id:'24hHsk345m',
            favorite:true,
            firstPlan:true,
            activePlan:false,
            bonusRewards:[
              { type: "cost", value: 10, rule:'menu Item', bonusReward:'birthday'},
              { type: "percentage", value: 20, rule:'menu Item', bonusReward:'firstPlanr'},
            ]
          },
          {
            reward_plan: rewardTemplates[1],
            visits: visits[1],
            points: points[1],
            redeemableRewards:[],
            reward_planAvail:true,
            exp_rewardsAvail:true,
            banner: "https://picsum.photos/300/200",
            logo: "https://picsum.photos/300/200",
            organization_id: organizationIds[1],
            shop_id:shopIds[1],
            name:shopNames[1],
            id:'34nDi3',
            favorite:false,
            firstPlan:false,
            activePlan:true
          },
          {
            reward_plan: rewardTemplates[1],
            visits: visits[2],
            points: points[2],
            redeemableRewards:['tier-2'],
            reward_planAvail:true,
            exp_rewardsAvail:false,
            banner: "https://picsum.photos/300/200",
            logo: "https://picsum.photos/300/200",
            organization_id: organizationIds[2],
            shop_id:shopIds[2],
            name:shopNames[2],
            id:'abcde',
            favorite:false,
            firstPlan:true,
            activePlan:false,
            bonusRewards:[
              { type: "cost", value: 10, rule:'menu Item', bonusReward:'birthday'},
              { type: "percentage", value: 20, rule:'menu Item', bonusReward:'firstPlanr'},
            ]
          }
        ];
        resolve(samplePlans);
      }, 500);
    });
}

export const mockPlan = (user_id:string, org_id:string): Promise<PlanProps> =>{
  return new Promise((resolve) => {
    setTimeout(() => {
      const samplePlan1: PlanProps = 
      {
        reward_plan: rewardTemplates[0],
        visits: visits[0],
        points: points[0],
        redeemableRewards: [],
        reward_planAvail: true,
        exp_rewardsAvail: true,
        firstPlan: false,
        activePlan: false,
        organization_id: organizationIds[0],
        shop_id: shopIds[0],
        name: shopNames[0],
        id: '341Dig',
        favorite: true
      };
      const samplePlan2: PlanProps = 
      {
        reward_plan: rewardTemplates[1],
        visits: visits[1],
        points: points[1],
        firstPlan: false,
        redeemableRewards: [],
        reward_planAvail:true,
        exp_rewardsAvail:true,
        activePlan: true,
        organization_id: organizationIds[1],
        shop_id:shopIds[1],
        name: shopNames[1],
        id: '341Dig',
        favorite: false

      };
      const samplePlan3: PlanProps = 
      {
        reward_plan: rewardTemplates[2],
        visits: visits[2],
        points: points[2],
        firstPlan:false,
        activePlan:true,
        redeemableRewards:['tier-2'],
        reward_planAvail:true,
        exp_rewardsAvail:true,
        organization_id: organizationIds[2],
        shop_id:shopIds[2],
        name: shopNames[2],
        id:'341Dig',
        favorite: false
      };
      const samplePlan4: PlanProps = 
      {
        reward_plan: rewardTemplates[3],
        visits: 0,
        points: 0,
        firstPlan:true,
        activePlan:false,
        redeemableRewards:[],
        reward_planAvail:true,
        exp_rewardsAvail:true,
        organization_id: organizationIds[3],
        shop_id:shopIds[3],
        name: shopNames[3],
        id:'341Dig',
        favorite: false
      };
      if(org_id === organizationIds[0]){
        resolve(samplePlan1)
      }
      else if (org_id === organizationIds[1]){
        resolve(samplePlan2)
      }else if (org_id === organizationIds[2]){
        resolve(samplePlan3)
      }
      else{
        resolve(samplePlan4)
      }
    }, 500);
  });
}

export const mockOrg = (user_id:string, org_id:string): Promise<OrganizationProps> =>{
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleOrg1: OrganizationProps = 
      {
        name: shopNames[0],
        description:orgDescription[0],
        banner: "https://picsum.photos/300/200",
        logo: 'https://picsum.photos/200'
      };
      const sampleOrg2: OrganizationProps = 
      {
        name: shopNames[1],
        description:orgDescription[1],
        banner: "https://picsum.photos/300/200",
        logo: 'https://picsum.photos/200'
      };
      const sampleOrg3: OrganizationProps = 
      {
        name: shopNames[2],
        description:orgDescription[2],
        banner: "https://picsum.photos/300/200",
        logo: 'https://picsum.photos/200'
      };
      const sampleOrg4: OrganizationProps = 
      {
        name: shopNames[3],
        description:orgDescription[3],
        banner: "https://picsum.photos/300/200",
        logo: 'https://picsum.photos/200'
      };
      if(org_id === organizationIds[0]){
        resolve(sampleOrg1)
      }
      else if (org_id === organizationIds[1]){
        resolve(sampleOrg2)
      }else if (org_id === organizationIds[2]){
        resolve(sampleOrg3)
      }
      else{
        resolve(sampleOrg4)
      }
    }, 500);
  });
}

export const mockDiscoverShops = (user_id: string, region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; }): Promise<ShopPreviewProps[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleShops: ShopPreviewProps[] = [
        {
          latitude: 29.6542,
          longitude: -82.3351,
          preview: 'https://picsum.photos/200',
          organization_id: organizationIds[0],
          shop_id: shopIds[0],
          name: shopNames[0],
          id: '24hHsk345m',
          favorite: true,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6478,
          longitude: -82.3173,
          preview: 'https://picsum.photos/200',
          organization_id: organizationIds[1],
          id: '24hHsk346m',
          shop_id: shopIds[1],
          name: shopNames[1],
          favorite: false,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6569,
          longitude: -82.3214,
          organization_id: organizationIds[2],
          shop_id: shopIds[2],
          name: shopNames[2],
          preview: 'https://picsum.photos/200',
          id: 'wjn4Sj320B',
          favorite: false,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6501,
          longitude: -82.3305,
          preview: 'https://picsum.photos/200',
          organization_id: organizationIds[3],
          shop_id: shopIds[3],
          name: shopNames[3],
          id: 'ien5J2k2',
          favorite: false,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        }
      ];
      resolve(sampleShops);
    }, 500);
  });
};

export const mockPopularShops = (user_id: string, pagination: number, region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; }): Promise<ShopPreviewProps[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const popularShops: ShopPreviewProps[] = [
        {
          latitude: 29.6553,
          longitude: -82.3411,
          preview: 'https://picsum.photos/200',
          organization_id: "org892",
          shop_id: shopIds[0],
          name: shopNames[0],
          id: 'pop1234',
          favorite: true,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6587,
          longitude: -82.3194,
          preview: 'https://picsum.photos/200',
          organization_id: "org128",
          shop_id: shopIds[1],
          name: shopNames[1],
          id: 'pop5678',
          favorite: false,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        }
      ];
      resolve(popularShops);
    }, 500);
  });
};

export const mockFavoriteShops = (user_id: string, pagination: number, region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; }): Promise<ShopPreviewProps[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const favoriteShops: ShopPreviewProps[] = [
        {
          latitude: 29.6521,
          longitude: -82.3408,
          preview: 'https://picsum.photos/200',
          organization_id: organizationIds[0],
          shop_id: shopIds[0],
          name: shopNames[0],
          id: 'fav1234',
          favorite: true,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6598,
          longitude: -82.3367,
          preview: 'https://picsum.photos/200',
          organization_id: organizationIds[1],
          shop_id: shopIds[1],
          name: shopNames[1],
          id: 'fav5678',
          favorite: true,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        }
      ];
      resolve(favoriteShops);
    }, 500);
  });
};

const generateShopHours = () => [
  { day: "Monday", open: "08:00", close: "20:00" },
  { day: "Tuesday", open: "08:00", close: "20:00" },
  { day: "Wednesday", open: "08:00", close: "20:00" },
  { day: "Thursday", open: "08:00", close: "20:00" },
  { day: "Friday", open: "08:00", close: "22:00" },
  { day: "Saturday", open: "09:00", close: "22:00" },
  { day: "Sunday", open: null, close: null },
];

export const mockfetchNearestShop = (org_id:string, region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number;}): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if(org_id === organizationIds[0]){
        resolve(shopIds[0]);
      }else if (org_id === organizationIds[1]){
        resolve(shopIds[1]);
      }else if(org_id === organizationIds[2]){
        resolve(shopIds[2]);
      }else{
        resolve(shopIds[3]);
      }
    }, 500);
  });
};

export { Profile };
