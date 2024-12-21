import { Plan, Profile, shop, shopPreview } from "@/app-data/data-types";

// These functions are intended to mock the API outputs with a mock Delay for frontend 
// Development while the real APIs are being created

// When APIS are ready create them here then replace the mock with the real APIs

export const mockShop = (shop_id:string, user_id:string): Promise<shop> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if(shop_id === '24hHsk345m'){
          resolve({
            id: "24hHsk345m",
            organization_id: "org456",
            location_id: "loc789",
            geohash: "dr5regw3n",
            banner: "https://picsum.photos/400/200",
            logo: 'https://picsum.photos/200',
            liked:true,
          });
        }else if (shop_id === '24hHsk346m'){
          resolve({
            id: "24hHsk346m",
            organization_id: "org456",
            location_id: "loc789",
            geohash: "dr5regw3n",
            banner: "https://picsum.photos/400/200",
            logo: 'https://picsum.photos/200',
            liked:false,
          });
        }else{
          resolve({
            id: "ien5J2k2",
            organization_id: "org456",
            location_id: "loc789",
            geohash: "dr5regw3n",
            banner: "https://picsum.photos/400/200",
            logo: 'https://picsum.photos/200',
            liked:false,
          });
        }
      }, 500);
    });
  };

  export const mockShopRadius = (user_id: string): Promise<shopPreview[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sampleShops: shopPreview[] = [
          {
            latitude: 29.6542,
            longitude: -82.3351,
            preview: 'https://picsum.photos/300',
            organization_id: "org456",
            geohash: '34jn3',
            location_id: "loc789",
            id: '24hHsk345m',
            name: 'Brolic Brunches',
            description: 'Yummy food everyday',
            liked: true,
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
              { day: "Sunday", open: "00:00", close: "00:00" },
            ],
          },
          {
            latitude: 29.6478,
            longitude: -82.3173,
            preview: 'https://picsum.photos/200',
            organization_id: "org446",
            geohash: '34jn3',
            location_id: "loc341",
            id: '24hHsk346m',
            name: 'Alpha Artichokes',
            description: 'Delicious food every day',
            liked: false,
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
              { day: "Sunday", open: "00:00", close: "00:00" },
            ],
          },
          {
            latitude: 29.6569,
            longitude: -82.3214,
            organization_id: "org596",
            location_id: "loc115",
            geohash: '34jn3',
            preview: 'https://picsum.photos/200',
            id: 'wjn4Sj320B',
            name: 'Beta Breaky',
            description: 'Crispy Food for the Hungry',
            liked: false,
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
              { day: "Sunday", open: "00:00", close: "00:00" },
            ],
          },
          {
            latitude: 29.6501,
            longitude: -82.3305,
            preview: 'https://picsum.photos/200',
            organization_id: "org123",
            geohash: '34jn3',
            location_id: "loc129",
            id: 'ien5J2k2',
            name: 'Los Tacos',
            description: 'Hand made authentic tacos',
            liked: false,
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
              { day: "Sunday", open: "00:00", close: "00:00" },
            ],
          }
        ];
        resolve(sampleShops);
      }, 1000);
    });
  };
  

export const mockDiscoverShops = (user_id:string): Promise<shopPreview[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleShops: shopPreview[] = [
        {
          latitude: 37.7749,
          longitude: -122.4194,
          preview: 'https://picsum.photos/200',
          organization_id: "org456",
          geohash:'34jn3',
          location_id: "loc789",
          id: '24hHsk345m',
          name: 'Brolic Brunches',
          description: 'Yummy food everyday',
          liked:true,
          location:{
            city:'Los Angelas',
            state:'California'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: "00:00", close: "00:00" },
          ],
        },
        {
          latitude: 37.7819,
          longitude: -122.4114,
          preview: 'https://picsum.photos/200',
          organization_id: "org446",
          geohash:'34jn3',
          location_id: "loc341",
          id: '24hHsk346m',
          name: 'Alpha Artichokes',
          description: 'Delicious food every day',
          liked:false,
          location:{
            city:'Los Angelas',
            state:'California'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: "00:00", close: "00:00" },
          ],
        },
        {
          latitude: 37.7919,
          longitude: -122.4144,
          organization_id: "org596",
          location_id: "loc115",
          geohash:'34jn3',
          preview: 'https://picsum.photos/200',
          id: 'wjn4Sj320B',
          name: 'Beta Breaky',
          description: 'Crispy Food for the Hungry',
          liked:false,
          location:{
            city:'Los Angelas',
            state:'California'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: "00:00", close: "00:00" },
          ],
        },
        {
          latitude: 37.7809,
          longitude: -122.3994,
          preview: 'https://picsum.photos/200',
          organization_id: "org123",
          geohash:'34jn3',
          location_id: "loc129",
          id: 'ien5J2k2',
          name: 'Los Tacos',
          description: 'Hand made authentic tacos',
          liked:false,
          location:{
            city:'Los Angelas',
            state:'California'
          },
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: "00:00", close: "00:00" },
          ],
        }
      ];
      resolve(sampleShops);
    }, 500);
  });
};
  
export const mockProfile = (): Promise<Profile> => {
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

export const mockPlans = (user_id:string): Promise<Plan[]> => {
  return new Promise((resolve) => {
      setTimeout(() => {
        const samplePlans: Plan[] = [{
          reward_plan: {
            road_map: {
              3: {
                id: "tier-3",
                rewards: [
                  { type: "cost", value: 5, rule: "menu Item" },
                  { type: "percentage", value: 10, rule: 0 },
                  { type: "percentage", value: 20, rule: "meal" },
                ],
              },
              6: {
                id: "tier-6",
                rewards: [
                  { type: "cost", value: 5, rule: 0 },
                  { type: "percentage", value: 20, rule: "entree" },
                  { type: "item", item: "appetizer", rule: "meal" },
                ],
              },
              9: {
                id: "tier-9",
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
                  { type: "cost", value: 15, rule:'menu Item' },
                  { type: "percentage", value: 25, rule:'menu Item' },
                  { type: "item", item: 'entree', rule:15},
                ]
              }
            },
            visits: 0,
            points: 0,
            redeemable:false,
            redeemableRewards:[],
            organization_id: "org12345",
            menu:'www.mock-menu-link.com',
            name:'Los Tacos',
            id:'341Dig',
            firstPlan:true,
            activePlan:false
        }, 
        {
          reward_plan: {
          road_map: {
            3: {
              id: "tier-3",
              rewards: [
                { type: "cost", value: 5, rule: "menu Item" },
                { type: "percentage", value: 10, rule: 0 },
                { type: "percentage", value: 20, rule: "meal" },
              ],
            },
            6: {
              id: "tier-6",
              rewards: [
                { type: "cost", value: 5, rule: 0 },
                { type: "percentage", value: 20, rule: "entree" },
                { type: "item", item: "appetizer", rule: "meal" },
              ],
            },
            9: {
              id: "tier-9",
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
                  { type: "cost", value: 10, rule:'menu Item' },
                  { type: "percentage", value: 20, rule:'menu Item'},
                  { type: "item", item: 'appetizer', rule:'meal'},
                ]
              }
            },
            visits: 5,
            points: 0,
            redeemable:false,
            redeemableRewards:[],
            organization_id: "org334",
            menu:'www.mock-menu-link.com',
            name:'Beta Breaky',
            id:'34nDi3',
            firstPlan:false,
            activePlan:true
        }];
        resolve(samplePlans);
      }, 500);
    });
}

export const mockPlan = (user_id:string, shop_id:string): Promise<Plan> =>{
  return new Promise((resolve) => {
    setTimeout(() => {
      const samplePlan1: Plan = 
      {
        reward_plan: {
          road_map: {
            3: {
              id: "tier-3",
              rewards: [
                { type: "cost", value: 5, rule: "menu Item" },
                { type: "percentage", value: 10, rule: 0 },
                { type: "percentage", value: 20, rule: "meal" },
              ],
            },
            6: {
              id: "tier-6",
              rewards: [
                { type: "cost", value: 5, rule: 0 },
                { type: "percentage", value: 20, rule: "entree" },
                { type: "item", item: "appetizer", rule: "meal" },
              ],
            },
            9: {
              id: "tier-9",
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
        visits: 5,
        points: 0,
        redeemable:false,
        redeemableRewards:['tier-3'],
        firstPlan:false,
        activePlan:false,
        menu:'www.mock-menu-link.com',
        organization_id: "org12345",
        name:'Los Tacos',
        id:'341Dig'
      };
      const samplePlan2: Plan = 
      {
        reward_plan: {
          road_map: {
            3: {
              id: "tier-3",
              rewards: [
                { type: "cost", value: 5, rule: "menu Item" },
                { type: "percentage", value: 10, rule: 0 },
                { type: "percentage", value: 20, rule: "meal" },
              ],
            },
            6: {
              id: "tier-6",
              rewards: [
                { type: "cost", value: 5, rule: 0 },
                { type: "percentage", value: 20, rule: "entree" },
                { type: "item", item: "appetizer", rule: "meal" },
              ],
            },
            9: {
              id: "tier-9",
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
        visits: 6,
        points: 50,
        redeemable:true,
        firstPlan:false,
        redeemableRewards:['tier-6'],
        menu:undefined,
        activePlan:false,
        organization_id: "org12345",
        name:'Los Tacos',
        id:'341Dig'
      };
      const samplePlan3: Plan = 
      {
        reward_plan: {
          road_map: {
            3: {
              id: "tier-3",
              rewards: [
                { type: "cost", value: 5, rule: "menu Item" },
                { type: "percentage", value: 10, rule: 0 },
                { type: "percentage", value: 20, rule: "meal" },
              ],
            },
            6: {
              id: "tier-6",
              rewards: [
                { type: "cost", value: 5, rule: 0 },
                { type: "percentage", value: 20, rule: "entree" },
                { type: "item", item: "appetizer", rule: "meal" },
              ],
            },
            9: {
              id: "tier-9",
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
        visits: 2,
        points: 80,
        redeemable:true,
        firstPlan:false,
        activePlan:false,
        menu:'www.mock-menu-link.com',
        redeemableRewards:[],
        organization_id: "org12345",
        name:'Los Tacos',
        id:'341Dig'
      };
      if(shop_id === '24hHsk345m'){
        resolve(samplePlan1)
      }
      else if (shop_id === '123456'){
        resolve(samplePlan3)
      }
      else{
        resolve(samplePlan2)
      }
    }, 500);
  });
}
