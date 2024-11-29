interface ShopHour {
    day: string;
    open: string | null;
    close: string | null;
  }
  
  interface shops {
    id: string; 
    organization_id: string; 
    location_id: string;
    geohash: string;
    latitude: number;
    longitude: number;
  }

  interface shop {
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
  
  
