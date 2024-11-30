// These functions are intended to mock the API outputs with a mock Delay for frontend Development purposes

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
          logo: "https://example.com/logo.png",
          banner: "https://example.com/banner.png",
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
            organization_id: "org456",
            geohash:'34jn3',
            location_id: "loc789",
            id: '24hHsk346m',
            name: 'Alpha Artichokes',
            description: 'Delicious food every day',
          },
          {
            latitude: 37.7919,
            longitude: -122.4144,
            organization_id: "org456",
            location_id: "loc789",
            geohash:'34jn3',
            logo: 'https://picsum.photos/200',
            id: 'wjn4Sj320B',
            name: 'Beta Breaky',
            description: 'Crispy Food for the Hungry',
          },
        ];
        resolve(sampleShops);
      }, 2000);
    });
  };
  
  