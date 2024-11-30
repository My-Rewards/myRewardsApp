import { mockDiscoverProfile, mockShopRadius } from '@/MockApis/api';
import { useContext, createContext, type PropsWithChildren, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useProps } from '@/app/LoadingProp/propsProvider';
import { Profile, regionProp, shop, shops } from './data-types';

const DataContext = createContext<{
    fetchShopsByRadius: (user_id:string, radius:number) => void; 
    fetchDiscoverShops: (user_id:string, filterOption:number) => void; 
    fetchProfile: (user_id:string) => void; 
    setRegion:(location:regionProp) => void;
    region:regionProp;
    radiusShops?: shops[] | null;
    discoverShops?: shops[] | null;
    shop?: shop | null;
    profile: any|null;
    isLoading: boolean;
    }>({
    fetchShopsByRadius: async () => null,
    fetchDiscoverShops: async () => null,
    fetchProfile: async () => null,
    setRegion: async () => null,
    radiusShops: null,
    discoverShops: null,
    region:
        {
            latitude: 28.5384,
            longitude: -81.3789,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        },
    shop: null,
    profile:null,
    isLoading: false,
  });

  export function localData() {
    const value = useContext(DataContext);
    if (process.env.NODE_ENV !== 'production') {
      if (!value) {
        throw new Error('appData must be wrapped in a <localData />');
      }
    }
    return value;
  }

  export function AppData({ children }: PropsWithChildren) {
    const { alert } = useProps();

    const [radiusShops, setRadiusShops] = useState<shops[]|null>();
    const [discoverShops, setDiscoverShopd] = useState<shops[]|null>();

    const [shop, setShop] = useState<shop|null>();
    const [profile, setProfile] = useState<Profile|null>();
    const [region, setRegion] = useState({
        latitude: 28.5384,
        longitude: -81.3789,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

    const [fetching, setFetching] = useState(false);

      useEffect(() => {
        async function getCurrentLocation() {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            alert('', 'Enable Access to your Location in Settings', 'error');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,      
          })
        }
    
        getCurrentLocation();
      }, []);


      useEffect(() => {
        if(!discoverShops){
            // Replace mock API with API here
            mockDiscoverProfile().then((shops)=>{
                setDiscoverShopd(shops)
             })
            .catch((error) => {
                console.error('Error fetching shops:', error);
              });
        }
        if (!radiusShops) {
            // Replace mock API with API here
            mockShopRadius()
            .then((shops) => {
              setRadiusShops(shops);
            })
            .catch((error) => {
              console.error('Error fetching shops:', error);
            });
        }
      }, [radiusShops, discoverShops, profile]);
  
    return (
      <DataContext.Provider
        value={{
            fetchShopsByRadius: async (user_id:string, radius:number) => {
                // Fetch + Update shops radiusShops given location
            },
            fetchDiscoverShops: async (user_id:string, filterOption:number) => {
                // Fetch + Update shops DiscoverShops given closet/popularity
                // You NEED to filter by distance regardless (a shop 300 miles away is useless to a user)

                try {
                    let shops;
                    switch (filterOption) {
                      case 0:
                        shops = await mockDiscoverProfile(); // Replace with nearby API call
                        break;
                      case 1:
                        shops = await mockDiscoverProfile(); // Replace with popular API call
                        break;
                      case 2:
                        shops = await mockDiscoverProfile(); // Replace with favorite API call
                        break;
                      default:
                        throw new Error("Invalid filter option");
                    }
                    setDiscoverShopd(shops);
                  } catch (error) {
                    console.error("Error fetching shops:", error);
                  }
            },
            fetchProfile: async (user_id:string) => {},
            setRegion: async (location:regionProp) => {setRegion(location)},
            radiusShops,
            discoverShops,
            shop,
            region,
            profile,
            isLoading: fetching
        }}>
        {children}
      </DataContext.Provider>
    );
  }