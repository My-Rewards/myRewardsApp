import { 
  mockDiscoverProfile, 
  mockPlans, 
  mockProfile, 
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
import { Plan, Profile, regionProp, shop, shopPreview } from './data-types';
import MapView from 'react-native-maps';

const DataContext = createContext<{
    fetchShopsByRadius: (user_id:string, radius:number) => void; 
    fetchDiscoverShops: (user_id:string, filterOption:number) => void;
    fetchPlans: (filterOption:number)=>void;
    fetchProfile: (user_id:string) => void; 
    locateMe: (map:React.RefObject<MapView>) => void; 
    setRegion:(location:regionProp) => void;
    region:regionProp;
    radiusShops?: shopPreview[] | null;
    discoverShops?: shopPreview[] | null;
    shop?: shop | null;
    profile?: Profile|null;
    plans?:Plan[]|null;
    isLoading: boolean;
    }>({
    fetchShopsByRadius: async () => null,
    fetchDiscoverShops: async () => null,
    fetchPlans: async () => null,
    fetchProfile: async () => null,
    locateMe: async () => null,
    setRegion: async () => null,
    radiusShops: null,
    discoverShops: null,
    region:
      {
        latitude: 28.5384,
        longitude: -81.3789,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
    shop: null,
    profile:null,
    plans:null,
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

    const [radiusShops, setRadiusShops] = useState<shopPreview[]|null>();
    const [discoverShops, setDiscoverShops] = useState<shopPreview[]|null>();
    const [shop, setShop] = useState<shop|null>();
    const [profile, setProfile] = useState<Profile|null>();
    const [plans, setPlans] = useState<Plan[]|null>();
    const [userLocation, setUserLocation] = useState<regionProp|null>();
    const [region, setRegion] = useState({
        latitude: 28.5384,
        longitude: -81.3789,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

    const [fetching, setFetching] = useState(false);

    async function getCurrentLocation() {
      setFetching(true);
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
          const permission = await Location.requestForegroundPermissionsAsync();
          if (permission.status !== 'granted') {
            alert('', 'Enable Access to your Location in Settings', 'error');
            return;
          }
        }
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
        console.error('Error fetching location:', error);
      } finally {
        setFetching(false);
      }
    }    

    async function rebaseUserLocation(map:React.RefObject<MapView>){
      if(userLocation){
        setRegion(userLocation)
      }else{
        getCurrentLocation()
      }
      
      if(userLocation && map.current){
        map.current.animateToRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: userLocation.latitudeDelta,
          longitudeDelta: userLocation.longitudeDelta,
        }, 0);
      }
    }

    useEffect(() => {
      if(!userLocation){
        getCurrentLocation();
      }
      
      if(!profile){
        setFetching(true)
        // Replace mock API with API here
        mockProfile().then((profile)=>{
          setProfile(profile)
         })
        .catch((error) => {
          console.error('Error fetching shops:', error);
        });
        setFetching(false)
      }
      if(!discoverShops){
        setFetching(true)
        // Replace mock API with API here
        mockDiscoverProfile().then((shops)=>{
          setDiscoverShops(shops)
        })
        .catch((error) => {
          console.error('Error fetching shops:', error);
        });
        setFetching(false)
      }
      if (!radiusShops) {
        setFetching(true)
        // Replace mock API with API here
        mockShopRadius()
        .then((shops) => {
          setRadiusShops(shops);
        })
        .catch((error) => {
          console.error('Error fetching shops:', error);
        });
        setFetching(false)
      }
      if(!plans){
        setFetching(true)
        // Replace mock API with API here
        mockPlans().then((plansData)=>{
          setPlans(plansData)
        })
        .catch((error) => {
            console.error('Error fetching shops:', error);
        }); 
        setFetching(false)
      }
    }, []);
  
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
                        mockDiscoverProfile().then((shops)=>{
                          setDiscoverShops(shops)
                       })
                      .catch((error) => {
                          console.error('Error fetching shops:', error);
                        }); // Replace with nearby API call
                        break;
                      case 1:
                        mockDiscoverProfile().then((shops)=>{
                          setDiscoverShops(shops)
                       })
                      .catch((error) => {
                          console.error('Error fetching shops:', error);
                        }); // Replace with popular API call
                        break;
                      case 2:
                        mockDiscoverProfile().then((shops)=>{
                          setDiscoverShops(shops)
                       })
                      .catch((error) => {
                          console.error('Error fetching shops:', error);
                        }); // Replace with favorite API call
                        break;
                      default:
                        throw new Error("Invalid filter option");
                    }
                    setDiscoverShops(shops);
                  } catch (error) {
                    console.error("Error fetching shops:", error);
                  }
            },
            fetchPlans: async (filterOption:number) => {
              try{
                setFetching(true)
                switch (filterOption) {
                  case 0:
                    mockPlans().then((plansData)=>{
                      setPlans(plansData)
                      setFetching(false)
                   })
                  .catch((error) => {
                      console.error('Error fetching shops:', error);
                    }); // Replace with nearby API call
                    break;
                  case 1:
                    mockPlans().then((plansData)=>{
                      setPlans([])
                      setFetching(false)
                    })
                    .catch((error) => {
                        console.error('Error fetching shops:', error);
                    }); // Replace with popular API call
                    // reorder with favorites first
                    break;
                  default:
                    throw new Error("Invalid filter option");
                }
              }catch(error){
                setFetching(false)
                console.error("Error fetching shops:", error);
              }

            },
            fetchProfile: async (user_id:string) => {
              
            },
            setRegion: async (location:regionProp) => {setRegion(location)},
            locateMe: async (map:React.RefObject<MapView>)=>{rebaseUserLocation(map)},
            radiusShops,
            discoverShops,
            shop,
            plans,
            region,
            profile,
            isLoading: fetching
        }}>
        {children}
      </DataContext.Provider>
    );
  }