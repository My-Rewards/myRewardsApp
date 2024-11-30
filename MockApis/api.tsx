import { Plan, Profile, shop, shops } from "@/app-data/data-types";

// These functions are intended to mock the API outputs with a mock Delay for frontend 
// Development while the real APIs are being created

export const mockShop = (): Promise<shop> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sampleShop: shop = {
          id: "shop123",
          organization_id: "org456",
          location_id: "loc789",
          geohash: "dr5regw3n",
          latitude: 40.7128,
          longitude: -74.006,
          shop_hours: [
            { day: "Monday", open: "08:00", close: "20:00" },
            { day: "Tuesday", open: "08:00", close: "20:00" },
            { day: "Wednesday", open: "08:00", close: "20:00" },
            { day: "Thursday", open: "08:00", close: "20:00" },
            { day: "Friday", open: "08:00", close: "22:00" },
            { day: "Saturday", open: "09:00", close: "22:00" },
            { day: "Sunday", open: "10:00", close: "18:00" },
          ],
          description: "A cozy coffee shop offering the best artisan coffee and pastries.",
          title: "Cozy Coffee Corner",
          logo: "https://picsum.photos/300/200",
          banner: "https://picsum.photos/300/200",
        };
        resolve(sampleShop);
      }, 2000);
    });
  };

export const mockShopRadius = (): Promise<shops[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sampleShops: shops[] = [
          {
            latitude: 37.7749,
            longitude: -122.4194,
            logo: 'https://picsum.photos/200',
            organization_id: "org456",
            geohash:'34jn3',
            location_id: "loc789",
            id: '24hHsk345m',
            name: 'Brolic Brunches',
            description: 'Yummy food everyday'
          },
          {
            latitude: 37.7819,
            longitude: -122.4114,
            logo: 'https://picsum.photos/200',
            organization_id: "org446",
            geohash:'34jn3',
            location_id: "loc341",
            id: '24hHsk346m',
            name: 'Alpha Artichokes',
            description: 'Delicious food every day',
          },
          {
            latitude: 37.7919,
            longitude: -122.4144,
            organization_id: "org596",
            location_id: "loc115",
            geohash:'34jn3',
            logo: 'https://picsum.photos/200',
            id: 'wjn4Sj320B',
            name: 'Beta Breaky',
            description: 'Crispy Food for the Hungry',
          },
          {
            latitude: 37.7809,
            longitude: -122.3994,
            logo: 'https://picsum.photos/200',
            organization_id: "org123",
            geohash:'34jn3',
            location_id: "loc129",
            id: 'ien5J2k2',
            name: 'Los Tacos',
            description: 'Hand made authentic tacos',
          }
        ];
        resolve(sampleShops);
      }, 2000);
    });
  };

  export const mockDiscoverProfile = (): Promise<shops[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sampleShops: shops[] = [
          {
            latitude: 37.7749,
            longitude: -122.4194,
            logo: 'https://picsum.photos/200',
            organization_id: "org456",
            geohash:'34jn3',
            location_id: "loc789",
            id: '24hHsk345m',
            name: 'Brolic Brunches',
            description: 'Yummy food everyday'
          },
          {
            latitude: 37.7819,
            longitude: -122.4114,
            logo: 'https://picsum.photos/200',
            organization_id: "org446",
            geohash:'34jn3',
            location_id: "loc341",
            id: '24hHsk346m',
            name: 'Alpha Artichokes',
            description: 'Delicious food every day',
          },
          {
            latitude: 37.7919,
            longitude: -122.4144,
            organization_id: "org596",
            location_id: "loc115",
            geohash:'34jn3',
            logo: 'https://picsum.photos/200',
            id: 'wjn4Sj320B',
            name: 'Beta Breaky',
            description: 'Crispy Food for the Hungry',
          },
          {
            latitude: 37.7809,
            longitude: -122.3994,
            logo: 'https://picsum.photos/200',
            organization_id: "org123",
            geohash:'34jn3',
            location_id: "loc129",
            id: 'ien5J2k2',
            name: 'Los Tacos',
            description: 'Hand made authentic tacos',
          }
        ];
        resolve(sampleShops);
      }, 2000);
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
            dob: 1072915200000,
            preferences: {
              theme: "dark",
            },
            date_registered: "2024-01-01",
          };
          resolve(sampleProfile);
        }, 2000);
      });
  }

  export const mockPlans = (): Promise<Plan> => {
    return new Promise((resolve) => {
        setTimeout(() => {
          const sampleProfile: Plan = {
            reward_plan: {
                road_map: {
                  "3": [
                    { type: "cost", value: 5 },
                    { type: "percentage", value: 10 }
                  ],
                  "6": [
                    { type: "cost", value: 10 },
                    { type: "percentage", value: 20 }
                  ]
                },
                exp_rewards: {
                  expenditure: "150",
                  rewardsOptions: [
                    { type: "cost", value: 20 },
                    { type: "percentage", value: 50 }
                  ]
                }
              },
              visits: 5,
              spent: 120,
              organization_id: "org12345"
          };
          resolve(sampleProfile);
        }, 2000);
      });
  }