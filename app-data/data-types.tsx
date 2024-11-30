    interface regionProp {    
        latitude: number,
        longitude: number,
        latitudeDelta: number,
        longitudeDelta: number
    }
    
    interface ShopHour {
    day: string;
    open: string | null;
    close: string | null;
  }
  
  interface shops {
    id: string; 
    organization_id: string; 
    location_id: string;
    logo:string;
    name:string;
    description:string;
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

  interface profile{

  }
  
  
