import { OrganizationProps, PlanProps, PreviewPlanProp, Profile, RewardSystem, shop, ShopPreviewProps } from "@/app-data/data-types";

// These functions are intended to mock the API outputs with a mock Delay for frontend 
// Development while the real APIs are being created

// When APIS are ready create them here then replace the mock with the real APIs

// This will serve as mock data for consistency
const shopIds=[
  '1333d3c6-b143-48b6-4556-3e1ecf3e743c',
  '1333d3c6-b143-48b6-4556-3e1ecf3e743c',
  '1333d3c6-b143-48b6-4556-3e1ecf3e743c',
  '1333d3c6-b143-48b6-4556-3e1ecf3e743c'
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
  '7e55caf9-9899-4621-b549-3796e31725d5',
  '7e55caf9-9899-4621-b549-3796e31725d5',
  '7e55caf9-9899-4621-b549-3796e31725d5',
  '7e55caf9-9899-4621-b549-3796e31725d5'
]

// const rewardTemplates:RewardSystem[]=[
//   {
//     rewards_loyalty: {
//       tierStep: 3,
//       rewards: {
//         0: {
//           id: "tier-1",
//           rewards: [
//             "$5 off any menu item",
//             "10% off next meal",
//             "$5 dollars off",
//           ],
//         },
//         1: {
//           id: "tier-2",
//           rewards: [
//             "$10 off any menu item",
//             "15% off next meal",
//             "15% off next meal",
//           ],
//         },
//         2: {
//           id: "tier-3",
//           rewards: [
//             "$15 off any menu item",
//             "20% off next meal",
//             "$25 dollars off",
//           ],
//         },
//       }
//     }
// },
//  {
//   rewards_loyalty: {
//     tierStep:3,
//     rewards:{
//       0: {
//         id: "tier-1",
//         rewards: [
//           "$5 off any menu item",
//           "10% off next meal",
//           "$5 dollars off",
//         ],
//       },
//       1: {
//         id: "tier-2",
//         rewards: [
//           "$10 off any menu item",
//           "15% off next meal",
//           "$15 dollars off",
//         ],
//       },
//       2: {
//         id: "tier-3",
//         rewards: [
//           "$15 off any menu item",
//           "20% off next meal",
//           "$25 dollars off",
//         ],
//       },
//     }
//   },
//     rewards_milestone: {
//       expenditure: 150,
//       rewardsOptions: [
//         "$5 off menu item",
//         "5% off next meal",
//         "$5 dollars off",
//       ],
//     }
// },
//   {
//     rewards_loyalty: {
//       tierStep: 3,
//       rewards: {
//         0: {
//           id: "tier-1",
//           rewards: [
//             "$5 off any menu item",
//             "10% off next meal",
//             "$5 dollars off",
//           ],
//         },
//         1: {
//           id: "tier-2",
//           rewards: [
//             "$10 off any menu item",
//             "15% off next meal",
//             "$15 dollars off",
//           ],
//         },
//         2: {
//           id: "tier-3",
//           rewards: [
//             "$15 off any menu item",
//             "20% off next meal",
//             "$25 dollars off",
//           ],
//         },
//       }
//     },
//       rewards_milestone: {
//         expenditure: 150,
//         rewardsOptions: [
//           "$5 off menu item",
//           "5% off next meal",
//           "$5 dollars off",
//         ],
//       }
//   },
//   {
//     rewards_loyalty: {
//       tierStep:3,
//       rewards:{
//         0: {
//           id: "tier-1",
//           rewards: [
//             "$5 off any menu item",
//             "10% off next meal",
//             "$5 dollars off",
//           ],
//         },
//         1: {
//           id: "tier-2",
//           rewards: [
//             "$10 off any menu item",
//             "15% off next meal",
//             "15% off next meal",
//           ],
//         },
//         2: {
//           id: "tier-3",
//           rewards: [
//             "$15 off any menu item" ,
//             "20% off next meal",
//             "$25 dollars off",
//           ],
//         },
//       }
//     },
//       rewards_milestone: {
//         expenditure: 150,
//         rewardsOptions: [
//           "$5 off menu item",
//           "5% off next meal",
//           "$5 dollars off",
//         ],
//       }
//   },
// ]

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
          banner: "https://picsum.photos/300/200",
          logo: 'https://picsum.photos/200',
          menu:undefined,
          phone_number:'5614455304',
          description:orgDescription[0],
          favorite:true,
          location: {
            city: 'Gainesville',
            state: 'Florida',
            address: '543 Archer Rd'
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
          menu:'https://www.mock-menu-link.com',
          phone_number:'5614936645',
          banner: "https://picsum.photos/300/200",
          logo: 'https://picsum.photos/200',
          description:orgDescription[1],
          favorite:false,
          location: {
            city: 'Gainesville',
            state: 'Florida',
            address: '123 Main St'
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
          menu:'https://www.mock-menu-link.com',
          phone_number:'5612331223',
          banner: "https://picsum.photos/300/200",
          logo: 'https://picsum.photos/200',
          description:orgDescription[2],
          favorite:false,
          location: {
            city: 'Gainesville',
            state: 'Florida',
            address: '543 Archer Rd'
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
          menu:'https://www.mock-menu-link.com',
          phone_number:'5612331223',
          banner: "https://picsum.photos/300/200",
          logo: 'https://picsum.photos/200',
          description:orgDescription[3],
          favorite:false,
          location: {
            city: 'Gainesville',
            state: 'Florida',
            address: '543 Archer Rd'
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
          distance:1234,
          location: {
            city: 'Gainesville',
            address:'Coral 123',
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
          distance:1234,
          favorite: false,
          location: {
            city: 'Gainesville',
            address:'Coral 123',
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
          distance:1234,
          favorite: false,
          location: {
            city: 'Gainesville',
            address:'Coral 123',
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
          distance:1234,
          location: {
            city: 'Gainesville',
            address:'Coral 123',
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

// export const mockProfile = (user_id:string): Promise<Profile> => {
//   return new Promise((resolve) => {
//       setTimeout(() => {
//         const sampleProfile: Profile = {
//           id: "A34ghjw",
//           username: "email@example.com",
//           role: "customer",
//           first_name: "John",
//           last_name: "Howil",
//           dob: new Date('2002-05-12'),
//           preferences: {
//             theme: "dark",
//           },
//           date_registered: "2024-01-01",
//         };
//         resolve(sampleProfile);
//       }, 500);
//     });
// }

// export const mockPlans = (user_id:string): Promise<PreviewPlanProp[]> => {
//   return new Promise((resolve) => {
//       setTimeout(() => {
//         const samplePlans: PreviewPlanProp[] = [
//           {
//             reward_plan: rewardTemplates[0],
//             visits: visits[0],
//             points: points[0],
//             redeemableRewards:[],
//             rl_active:true,
//             rm_active:false,
//             banner: "https://picsum.photos/300/200",
//             logo: "https://picsum.photos/300/200",
//             organization_id: organizationIds[0],
//             name:shopNames[0],
//             id:'24hHsk345m',
//             firstPlan:true,
//             activePlan:false,
//             active:true,
//             favorite:false
//           },
//           {
//             reward_plan: rewardTemplates[1],
//             visits: visits[1],
//             points: points[1],
//             redeemableRewards:[],
//             rl_active:true,
//             rm_active:true,
//             banner: "https://picsum.photos/300/200",
//             logo: "https://picsum.photos/300/200",
//             organization_id: organizationIds[1],
//             name:shopNames[1],
//             id:'34nDi3',
//             firstPlan:false,
//             activePlan:true,
//             active:true,
//             favorite:false
//           },
//           {
//             reward_plan: rewardTemplates[1],
//             visits: visits[2],
//             points: points[2],
//             redeemableRewards:['tier-2'],
//             rl_active:true,
//             rm_active:false,
//             banner: "https://picsum.photos/300/200",
//             logo: "https://picsum.photos/300/200",
//             organization_id: organizationIds[2],
//             name:shopNames[2],
//             id:'abcde',
//             firstPlan:true,
//             activePlan:false,
//             active:true,
//             favorite:false
//           }
//         ];
//         resolve(samplePlans);
//       }, 500);
//     });
// }


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
          distance:1234,
          location: { city: 'Gainesville', state: 'Florida', address:'123 Coral' },
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
          distance:1234,
          favorite: false,
          location: { city: 'Gainesville', state: 'Florida', address:'123 Coral' },
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
          distance:1234,
          location: { city: 'Gainesville', state: 'Florida', address:'123 Coral' },
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
          distance:1234,
          favorite: false,
          location: { city: 'Gainesville', state: 'Florida', address:'123 Coral' },
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
          distance:1234,
          location: { city: 'Gainesville', state: 'Florida', address:'123 Coral' },
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
          distance:1234,
          location: { city: 'Gainesville', state: 'Florida', address:'123 Coral' },
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
          distance:1234,
          location: { city: 'Gainesville', state: 'Florida', address:'123 Coral' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6598,
          longitude: -82.3367,
          preview: 'https://picsum.photos/200',
          organization_id: organizationIds[1],
          shop_id: shopIds[1],
          name: shopNames[1],
          distance:1234,
          id: 'fav5678',
          favorite: true,
          location: { city: 'Gainesville', state: 'Florida', address:'123 Coral' },
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
