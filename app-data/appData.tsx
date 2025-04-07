import { 
  mockDiscoverShops, 
  mockFavoriteShops, 
  mockPlans, 
  mockPopularShops, 
  // mockProfile, 
  mockShopRadius 
}   from '@/APIs/api';
import { 
  useContext, 
  createContext, 
  type PropsWithChildren, 
  useState, 
  useEffect 
} from 'react';
import * as Location from 'expo-location';
import { useProps } from '@/app/LoadingProp/propsProvider';
import { Plan, PreviewPlanProp, Profile, regionProp, ShopPreviewProps, AppConfig } from './data-types';
import Map from 'react-native-maps';
import fetchUser from '@/APIs/fetchUser';
import { fetchAppConfig } from '@/APIs/fetchConfig';
import { set } from 'zod';

const DataContext = createContext<{
    fetchShopsByRadius: (currRegion:regionProp) => void; 
    fetchDiscoverShops: (filterOption:number, pagination:number) => void;
    fetchPlans: ()=>void;
    fetchProfile: () => void; 
    locateMe: (map:React.RefObject<Map>) => void; 
    setRegion:(location:regionProp) => void;
    region:regionProp;
    radiusShops?: ShopPreviewProps[] | null;
    discoverShopsFilter1?: ShopPreviewProps[] | null;
    discoverShopsFilter2?: ShopPreviewProps[] | null;
    discoverShopsFilter3?: ShopPreviewProps[] | null;
    shopPreviewCache?:ShopPreviewProps|null
    profile?: Profile|null;
    plans?:PreviewPlanProp[]|null;
    favoritePlans?:PreviewPlanProp[]|null;
    isPage1Loading: boolean;
    isPage2Loading: boolean;
    isPage3Loading: boolean;
    isPage4Loading: boolean;
    userLocation:regionProp|null;
    fetchAppConfig: () => Promise<AppConfig | null>;
    appConfig: AppConfig | null;
    }>({
    fetchShopsByRadius: async () => null,
    fetchDiscoverShops: async () => null,
    fetchPlans: async () => null,
    fetchProfile: async () => null,
    locateMe: async () => null,
    setRegion: async () => null,
    radiusShops: null,
    discoverShopsFilter1: null,
    discoverShopsFilter2: null,
    discoverShopsFilter3: null,
    shopPreviewCache:null,
    region:
      {
        latitude: 28.5384,
        longitude: -81.3789,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
    profile:null,
    plans:null,
    favoritePlans:null,
    isPage1Loading: false,
    isPage2Loading: false,
    isPage3Loading: false,
    isPage4Loading: false,
    userLocation:null,
    fetchAppConfig: async () => null,
    appConfig: null,
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

  export function AppData({ children, userSub }: PropsWithChildren & { userSub: string }) {    const { alert } = useProps();
    const [radiusShops, setRadiusShops] = useState<ShopPreviewProps[]|null>();    
    const [profile, setProfile] = useState<Profile|null>();
    const [userLocation, setUserLocation] = useState<regionProp|null>(null);
    const [appConfig, setAppConfig] = useState<AppConfig|null>(null);
    // plans never gets updated (sort with filteredPlans)
    const [plans, setPlans] = useState<PreviewPlanProp[]|null>();
    const [favoritePlans, setFavoritePlans] = useState<PreviewPlanProp[]|null>();

    const [region, setRegion] = useState({
        latitude: 28.5384,
        longitude: -81.3789,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

    const [fetchingPage1, setFetchingPage1] = useState(false);
    const [fetchingPage2, setFetchingPage2] = useState(false);
    const [fetchingPage3, setFetchingPage3] = useState(false);
    const [fetchingPage4, setFetchingPage4] = useState(false);

    const [discoverShopsFilter1, setDiscoverShopsFilter1] = useState<ShopPreviewProps[]|null>();
    const [discoverShopsFilter2, setDiscoverShopsFilter2] = useState<ShopPreviewProps[]|null>();
    const [discoverShopsFilter3, setDiscoverShopsFilter3] = useState<ShopPreviewProps[]|null>();

    useEffect(() => {
      const fetchData = async () => {
        try {
          if (!userLocation) {
            await getCurrentLocation();
          }
    
          if (!profile) {
              const fetchedProfile = await fetchUser();
              setProfile(fetchedProfile);
              setFetchingPage4(false);
          }

          if(!appConfig) {
            // const appConfig = await fetchAppConfig();
            // if (!appConfig) {
            //   return null;
            // }
            setAppConfig(appConfig);
          }
    
          if (!(discoverShopsFilter1 || discoverShopsFilter2 || discoverShopsFilter3)) {
            setFetchingPage2(true);
            try {
              // Replace mock API with actual API
              // set discover and maps to same value because theyre identical upon load until we figure more optimal method
              const shops1 = await mockDiscoverShops(userSub, region)
              setDiscoverShopsFilter1(shops1);
              setRadiusShops(shops1);

              const shops2 = await mockPopularShops(userSub, 0, region)
              setDiscoverShopsFilter2(shops2);
              const shops3 = await mockFavoriteShops(userSub, 0, region)
              setDiscoverShopsFilter3(shops3);
              
            } catch (error) {
              console.error('Error fetching discover shops:', error);
            } finally {
              setFetchingPage2(false);
            }
          }
    
          if (!plans) {
            setFetchingPage4(true);
            try {
              // Replace mock API with actual API
              const plansData = await mockPlans(userSub);
              setPlans(plansData);

              // find favorites and set it
              setFavoritePlans([])
            } catch (error) {
              console.error('Error fetching plans:', error);
            } finally {
              setFetchingPage4(false);
            }
          }
        } catch (error) {
          console.error('Error in fetchData sequence:', error);
        }
      };
    
      fetchData(); // Call the async function
    }, []);

    async function getCurrentLocation() {
      setFetchingPage2(true);
      try {
        const location = await Location.getCurrentPositionAsync({});

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          const permission = await Location.requestForegroundPermissionsAsync();
          if (permission.status !== 'granted') {
            alert('', 'Enable Access to your Location in Settings', 'error');
            return;
          }
        }
      } finally {
        setFetchingPage2(false);
      }
    }    

    async function rebaseUserLocation(map:React.RefObject<Map>){
      getCurrentLocation()
      if(userLocation && map.current){
        map.current.animateToRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: userLocation.latitudeDelta,
          longitudeDelta: userLocation.longitudeDelta,
        }, 0);
      }
    }

    return (
      <DataContext.Provider
        value={{
            fetchShopsByRadius: async (currRegion:regionProp) => {
              // Fetch + Update shops radiusShops given location
              // if(currRegion.latitudeDelta > furthestFetch.latitudeDelta*1.2 
              //   && currRegion.longitudeDelta > furthestFetch.longitudeDelta*1.2
              //   && !fetchingPage2){
              //   setFetchingPage2(true)
              //   setFurthestFetch(currRegion)
              //   console.log(currRegion)
              //   setTimeout(()=>{
              //     setFetchingPage2(false)
              //   },2000)
              // }
            },
            fetchDiscoverShops: async (filterOption:number, pagination:number): Promise<void> => {
                // Fetch + Update shops DiscoverShops given closet/popularity
                // You NEED to filter by distance regardless (a shop 300 miles away is useless to a user)
                setFetchingPage1(true)
                try {
                  switch (filterOption) {
                    case 0:
                      const shop1 = await mockDiscoverShops(userSub, region)
                      setDiscoverShopsFilter1(shop1)
                      setFetchingPage1(false)
                      break;
                    case 1:
                      const shops2 = await mockPopularShops(userSub, pagination, region)
                      if(pagination>0){
                        setDiscoverShopsFilter2((prevShops) => [...(prevShops || []), ...shops2]);
                        }
                      else{
                        setDiscoverShopsFilter2(shops2)
                      }                      
                      setFetchingPage1(false)
                      break;
                    case 2:
                      const shop3 = await mockFavoriteShops(userSub, pagination, region)
                      if(pagination>0){
                        setDiscoverShopsFilter3((prevShops) => [...(prevShops || []), ...shop3]);
                        }else{
                        setDiscoverShopsFilter3(shop3)
                      }                     
                      setFetchingPage1(false)
                      break;
                    default:
                      throw new Error("Invalid filter option");
                  }
                } catch (error) {
                  console.error("Error fetching shops:", error);
                }
            },
            fetchPlans: async () => {
              // this will sort plans to show only the favorite 
              try{
                setFetchingPage3(true)
                const fetchedPlans = await mockPlans(userSub);
                setPlans(fetchedPlans)
                // Filter Plans again and set it
                setFavoritePlans(fetchedPlans)
                setFetchingPage3(false)

              }catch(error){
                setFetchingPage3(false)
                console.error("Error fetching shops:", error);
              }

            },
            fetchProfile: async () => {
              const profile = await fetchUser();
              setProfile(profile);
              return profile;
            },
            setRegion: async (location:regionProp) => {setRegion(location)},
            locateMe: async (map:React.RefObject<Map>)=>{rebaseUserLocation(map)},
            radiusShops,
            discoverShopsFilter1,
            discoverShopsFilter2,
            discoverShopsFilter3,
            plans:plans,
            favoritePlans:favoritePlans,
            region,
            profile,
            userLocation,
            isPage1Loading: fetchingPage1,
            isPage2Loading: fetchingPage2,
            isPage3Loading: fetchingPage3,
            isPage4Loading: fetchingPage4,
            fetchAppConfig: async () => { 
              // const appConfig = await fetchAppConfig();
              // if (!appConfig) {
              //   return null;
              // }
              setAppConfig(appConfig);
              return appConfig;
            },
            appConfig,
        }}>
        {children}
      </DataContext.Provider>
    );
  }