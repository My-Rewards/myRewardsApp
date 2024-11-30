import { mockShopRadius } from '@/MockApis/api';
import { useContext, createContext, type PropsWithChildren, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useProps } from '@/app/LoadingProp/propsProvider';

const DataContext = createContext<{
    fetchShopsByRadius: (radius:number, location: {longitude:string, latitude:string}) => void; 
    fetchShopsByPopular: (location: {longitude:string, latitude:string}) => void; 
    fetchShopsByLiked: (location: {longitude:string, latitude:string}) => void; 
    fetchProfile: (id:string) => void; 
    setRegion:(location:regionProp) => void;
    region:regionProp;
    radiusShops?: shops[] | null;
    shop?: shop | null;
    profile: any|null;
    isLoading: boolean;
    }>({
    fetchShopsByRadius: async () => null,
    fetchShopsByPopular: async () => null,
    fetchShopsByLiked: async () => null,
    fetchProfile: async () => null,
    setRegion: async () => null,
    radiusShops: null,
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
    const [shop, setShop] = useState<shop|null>();
    const [profile, setProfile] = useState<shops[]|null>();
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
        if (!radiusShops) {
          console.log('Fetching radius shops...');
          setFetching(true);
          mockShopRadius()
            .then((shops) => {
              setRadiusShops(shops);
              setFetching(false);
            })
            .catch((error) => {
              console.error('Error fetching shops:', error);
              setFetching(false);
            });
        }
      }, [radiusShops, ]);
  
    return (
      <DataContext.Provider
        value={{
            fetchShopsByRadius: async (radius:number, location: {longitude:string, latitude:string}) => {
                // Fetch + Update shops radiusShops given location
            },
            fetchShopsByLiked: async (location: {longitude:string, latitude:string}) => {
                // Fetch + Update shops DiscoverShops given closet/popularity
                // You NEED to filter by distance regardless (a shop 300 miles away is useless to a user)
            },
            fetchShopsByPopular: async (location: {longitude:string, latitude:string}) => {
                // Fetch + Update shops DiscoverShops given closet/popularity
                // You NEED to filter by distance regardless (a shop 300 miles away is useless to a user)
            },
            fetchProfile: async (id:string) => {},
            setRegion: async (location:regionProp) => {setRegion(location)},
            radiusShops,
            shop,
            region,
            profile,
            isLoading: fetching
        }}>
        {children}
      </DataContext.Provider>
    );
  }