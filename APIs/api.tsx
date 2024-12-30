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
          latitude: 29.6542,
          longitude: -82.3351,
          name: 'Brolic Brunches',
          location_id: "loc789",
          geohash: "dr5regw3n",
          banner: "https://picsum.photos/300/200",
          menu:undefined,
          phoneNumber:'5614455304',
          logo: 'https://picsum.photos/200',
          description:'Super Yummy food',
          liked:true,
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
      }else if (shop_id === '24hHsk346m'){
        resolve({
          id: "24hHsk346m",
          organization_id: "org456",
          latitude: 29.6478,
          longitude: -82.3173,
          name: 'Alpha Artichokes',
          location_id: "loc789",
          geohash: "dr5regw3n",
          menu:'https://www.mock-menu-link.com',
          phoneNumber:'5614936645',
          banner: "https://picsum.photos/300/200",
          logo: 'https://picsum.photos/200',
          description:'Declicous handmade meals, with fresh ingredients',
          liked:false,
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
          id: "ien5J2k2",
          organization_id: "org456",
          name: 'Beta Breaky',
          latitude: 29.6569,
          longitude: -82.3214,
          location_id: "loc789",
          geohash: "dr5regw3n",
          menu:'https://www.mock-menu-link.com',
          phoneNumber:'5612331223',
          banner: "https://picsum.photos/300/200",
          logo: 'https://picsum.photos/200',
          description:'Mixed mexican and italian cuisine',
          liked:false,
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

export const mockShopRadius = (user_id: string): Promise<shopPreview[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleShops: shopPreview[] = [
        {
          latitude: 29.6542,
          longitude: -82.3351,
          preview: 'https://picsum.photos/300',
          organization_id: "org456",
          location_id: "loc789",
          id: '24hHsk345m',
          name: 'Brolic Brunches',
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
            { day: "Sunday", open: null, close: null },
          ],
        },
        {
          latitude: 29.6478,
          longitude: -82.3173,
          preview: 'https://picsum.photos/200',
          organization_id: "org446",
          location_id: "loc341",
          id: '24hHsk346m',
          name: 'Alpha Artichokes',
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
            { day: "Sunday", open: null, close: null },
          ],
        },
        {
          latitude: 29.6569,
          longitude: -82.3214,
          organization_id: "org596",
          location_id: "loc115",
          preview: 'https://picsum.photos/200',
          id: 'wjn4Sj320B',
          name: 'Beta Breaky',
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
            { day: "Sunday", open: null, close: null },
          ],
        },
        {
          latitude: 29.6501,
          longitude: -82.3305,
          preview: 'https://picsum.photos/200',
          organization_id: "org123",
          location_id: "loc129",
          id: 'ien5J2k2',
          name: 'Los Tacos',
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
            redeemableRewards:[],
            reward_planAvail:true,
            exp_rewardsAvail:true,
            organization_id: "org12345",
            name:'Brolic Brunches',
            id:'24hHsk345m',
            firstPlan:true,
            activePlan:false,
            bonusRewards:[
              { type: "cost", value: 10, rule:'menu Item', bonusReward:'birthday'},
              { type: "percentage", value: 20, rule:'menu Item', bonusReward:'firstPlanr'},
            ]
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
            redeemableRewards:[],
            reward_planAvail:true,
            exp_rewardsAvail:true,
            organization_id: "org334",
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
        redeemableRewards:['tier-3'],
        reward_planAvail:true,
        exp_rewardsAvail:true,
        firstPlan:false,
        activePlan:false,
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
              { type: "cost", value: 20, rule: 'menu Item' },
              { type: "percentage", value: 50, rule: 'menu Item' },
              { type: "item", item: 'entree', rule: 0 },
            ]
          }
        },
        visits: 6,
        points: 50,
        firstPlan: false,
        redeemableRewards: ['tier-6'],
        reward_planAvail:true,
        exp_rewardsAvail:true,
        activePlan: true,
        organization_id: "org12345",
        name: 'Los Tacos',
        id: '341Dig',
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
        firstPlan:false,
        activePlan:true,
        redeemableRewards:[],
        reward_planAvail:true,
        exp_rewardsAvail:true,
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

export const mockDiscoverShops = (user_id: string, region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; }): Promise<shopPreview[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleShops: shopPreview[] = [
        {
          latitude: 29.6542,
          longitude: -82.3351,
          preview: 'https://picsum.photos/200',
          organization_id: "org456",
          location_id: "loc789",
          id: '24hHsk345m',
          name: 'Brolic Brunches',
          liked: true,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6478,
          longitude: -82.3173,
          preview: 'https://picsum.photos/200',
          organization_id: "org446",
          location_id: "loc341",
          id: '24hHsk346m',
          name: 'Alpha Artichokes',
          liked: false,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6569,
          longitude: -82.3214,
          organization_id: "org596",
          location_id: "loc115",
          preview: 'https://picsum.photos/200',
          id: 'wjn4Sj320B',
          name: 'Beta Breaky',
          liked: false,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6501,
          longitude: -82.3305,
          preview: 'https://picsum.photos/200',
          organization_id: "org123",
          location_id: "loc129",
          id: 'ien5J2k2',
          name: 'Los Tacos',
          liked: false,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        }
      ];
      resolve(sampleShops);
    }, 500);
  });
};

export const mockPopularShops = (user_id: string, pagination: number, region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; }): Promise<shopPreview[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const popularShops: shopPreview[] = [
        {
          latitude: 29.6553,
          longitude: -82.3411,
          preview: 'https://picsum.photos/200',
          organization_id: "org892",
          location_id: "loc456",
          id: 'pop1234',
          name: 'Golden Griddles',
          liked: true,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6587,
          longitude: -82.3194,
          preview: 'https://picsum.photos/200',
          organization_id: "org128",
          location_id: "loc987",
          id: 'pop5678',
          name: 'Burger Bazaar',
          liked: false,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        }
      ];
      resolve(popularShops);
    }, 500);
  });
};

export const mockFavoriteShops = (user_id: string, pagination: number, region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; }): Promise<shopPreview[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const favoriteShops: shopPreview[] = [
        {
          latitude: 29.6521,
          longitude: -82.3408,
          preview: 'https://picsum.photos/200',
          organization_id: "org444",
          location_id: "loc542",
          id: 'fav1234',
          name: 'Coffee Haven',
          liked: true,
          location: { city: 'Gainesville', state: 'Florida' },
          shop_hours: generateShopHours(),
        },
        {
          latitude: 29.6598,
          longitude: -82.3367,
          preview: 'https://picsum.photos/200',
          organization_id: "org333",
          location_id: "loc331",
          id: 'fav5678',
          name: 'Pizza Palace',
          liked: true,
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