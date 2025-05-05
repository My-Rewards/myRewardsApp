import React, {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from "react";
import * as Location from "expo-location";
import { useProps } from "@/app/LoadingProp/propsProvider";
import {
  Plan,
  PreviewPlanProp,
  Profile,
  regionProp,
  ShopPreviewProps,
  AppConfig,
  mapPinProps,
} from "./data-types";
import Map from "react-native-maps";
import fetchUser from "@/APIs/ProfileAPIs/fetchUser";
import { fetchAppConfig } from "@/APIs/ExternalAPIs/fetchConfig";
import { set } from "zod";
import { fetchNearbyShops } from "@/APIs/DiscoverAPIs/discoverShops";
import { fetchRadiusShops } from "@/APIs/MapAPIs/fetchRadiusShops";
import { fetchSearchedShop } from "@/APIs/DiscoverAPIs/fetchSearchedShop";
import {fetchUserLikedPlans, fetchUserPlans} from "@/APIs/PlanAPIs/fetchUserPlans";
import { fetchPopularShops } from "@/APIs/DiscoverAPIs/fetchPopularShops";
import { fetchFavoriteShops } from "@/APIs/DiscoverAPIs/fetchFavoriteShops";
import {AppState} from "react-native";
const DataContext = createContext<{
  fetchShopsByRadius: (currRegion: regionProp) => void;
  fetchDiscoverShops: (filterOption: number, refresh: boolean) => void;
  fetchNearestShopResult: (shop_name: string) => void;
  fetchPlans: (filterOption: number, refresh: boolean) => void;
  fetchProfile: () => void;
  locateMe: (map: React.RefObject<Map>) => void;
  setRegion: (location: regionProp) => void;
  region: regionProp;
  radiusShops?: mapPinProps[] | null;
  discoverShopsFilter1?: ShopPreviewProps[] | null;
  discoverShopsFilter2?: ShopPreviewProps[] | null;
  discoverShopsFilter3?: ShopPreviewProps[] | null;
  shopPreviewCache?: ShopPreviewProps | null;
  profile?: Profile | null;
  plans?: PreviewPlanProp[] | null;
  favoritePlans?: PreviewPlanProp[] | null;
  updateShopFavorite: (shop_id: string, isFav: boolean) => void;
  isPage1Loading: boolean;
  isPage2Loading: boolean;
  isPage3Loading: boolean;
  isPage4Loading: boolean;
  userLocation: regionProp | null;
  fetchAppConfig: () => Promise<AppConfig | null>;
  appConfig: AppConfig | null;
  isShopSearched: boolean;
}>({
  fetchShopsByRadius: async () => null,
  fetchDiscoverShops: async () => null,
  fetchPlans: async () => null,
  fetchNearestShopResult: async () => null,
  fetchProfile: async () => null,
  locateMe: async () => null,
  setRegion: async () => null,
  radiusShops: null,
  discoverShopsFilter1: null,
  discoverShopsFilter2: null,
  discoverShopsFilter3: null,
  shopPreviewCache: null,
  region: {
    latitude: 28.5384,
    longitude: -81.3789,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  },
  profile: null,
  plans: null,
  favoritePlans: null,
  updateShopFavorite: () => null,
  isPage1Loading: false,
  isPage2Loading: false,
  isPage3Loading: false,
  isPage4Loading: false,
  userLocation: null,
  fetchAppConfig: async () => null,
  appConfig: null,
  isShopSearched: false,
});

export function localData() {
  return useContext(DataContext);
}

export function AppData({
  children,
}: PropsWithChildren & { userSub: string }) {
  const { alert } = useProps();
  const [radiusShops, setRadiusShops] = useState<mapPinProps[] | null>();
  const [profile, setProfile] = useState<Profile | null>();
  const [userLocation, setUserLocation] = useState<regionProp | null>(null);
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [plans, setPlans] = useState<PreviewPlanProp[] | null>();
  const [favoritePlans, setFavoritePlans] = useState<
    PreviewPlanProp[] | null
  >();

  // Pagination attributes
  const [discoverPage1, setDiscoverPage1] = useState(1);
  const [discoverPage2, setDiscoverPage2] = useState(1);
  const [discoverPage3, setDiscoverPage3] = useState(1);

  const [plansPage1, setPlansPage1] = useState(1);
  const [plansPage2, setPlansPage2] = useState(1);

  const [region, setRegion] = useState<regionProp>({
    latitude: 28.5384,
    longitude: -81.3789,
    latitudeDelta: userLocation?.latitudeDelta || 0.008,
    longitudeDelta: userLocation?.longitudeDelta || 0.008,
  });

  const [fetchingPage1, setFetchingPage1] = useState(false);
  const [fetchingPage2, setFetchingPage2] = useState(false);
  const [fetchingPage3, setFetchingPage3] = useState(false);
  const [fetchingPage4, setFetchingPage4] = useState(false);
  const [isShopSearched, setIsShopSearched] = useState(false);

  const [discoverShopsFilter1, setDiscoverShopsFilter1] = useState<
    ShopPreviewProps[] | null
  >();
  const [discoverShopsFilter2, setDiscoverShopsFilter2] = useState<
    ShopPreviewProps[] | null
  >();
  const [discoverShopsFilter3, setDiscoverShopsFilter3] = useState<
    ShopPreviewProps[] | null
  >();

  const bootstrap = async () => {
    try {
      if (!profile) {
        const fetchedProfile = await fetchUser();
        setProfile(fetchedProfile);
        setFetchingPage4(false);
      }

      if (!appConfig) {
        setAppConfig(appConfig);
      }

      if (
          !(
              discoverShopsFilter1 ||
              discoverShopsFilter2 ||
              discoverShopsFilter3
          )
      ) {

        await fetchDiscoverPage1();
        await fetchDiscoverPage2();
        await fetchDiscoverPage3();
      }

      if (!radiusShops) {
        await setMapPageShops();
      }
      if (!plans) {
        setFetchingPage4(true);

        await fetchPlansPage1();
        await fetchPlansPage2();

        setFetchingPage4(false);
      }
    } catch (error) {
      console.error("Error in fetchData sequence:", error);
    }
  };

  useEffect(() => {
    getCurrentLocation().catch(console.error);

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        getCurrentLocation().catch(console.error);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if(userLocation) bootstrap();
  }, [userLocation]);

  async function getCurrentLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        mayShowUserSettingsDialog: true,
      });
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
      })

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

    } catch (error) {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== "granted") {
          alert("", "Enable Access to your Location in Settings", "error");
          return;
        }
      }
    } 
  }

  async function rebaseUserLocation(map: React.RefObject<Map>) {
    const coords = userLocation ? userLocation : await getCurrentLocation()

    if (coords && map.current) {
      map.current.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: coords.latitudeDelta,
          longitudeDelta: coords.longitudeDelta,
        },
        300
      );
    }

    await getCurrentLocation();
  }

  // Discover Shops requests
  const fetchDiscoverPage1 = async (page: number = discoverPage1): Promise<void> => {
    if(page === -1) return;

    const coords = userLocation ? userLocation : await getCurrentLocation()

    if (coords) {
      let currentShops = page>1? discoverShopsFilter1 || [] : [];

      if(isShopSearched){
        setIsShopSearched(false);
        currentShops = [];
      }
      const response = await fetchNearbyShops(
        coords.longitude,
        coords.latitude,
        page
      );

      if (!response || !Array.isArray(response.value)) return;

      const shops = response.value;
      const updatedShops: ShopPreviewProps[] = [...currentShops, ...shops];

      setDiscoverShopsFilter1(updatedShops);
      if(response.pagination.hasMore) {
        setDiscoverPage1(response.pagination.nextPage);
      } else {
        setDiscoverPage1(-1);
      }
    }
  };

  const fetchDiscoverPage2 = async (page: number = discoverPage2): Promise<void> => {
    if(page === -1) return;
    let currentShops = page>1? discoverShopsFilter1 || [] : [];

      if(isShopSearched){
        setIsShopSearched(false);
        currentShops = [];
      }
      const response = await fetchPopularShops(
          page
      );

      if (!response || !Array.isArray(response.value)) return;

      const shops = response.value;
      const updatedShops: ShopPreviewProps[] = [...currentShops, ...shops];

      setDiscoverShopsFilter2(updatedShops);
      if(response.pagination.hasMore) {
        setDiscoverPage2(response.pagination.nextPage);
      } else {
        setDiscoverPage2(-1);
      }
  };

  const fetchDiscoverPage3 = async (page: number = discoverPage3): Promise<void> => {
    if(page === -1) return;
    let coords = userLocation ? userLocation : await getCurrentLocation()

    if (coords) {
      let currentShops = page>1? discoverShopsFilter1 || [] : [];

      if(isShopSearched){
        setIsShopSearched(false);
        currentShops = [];
      }
      const response = await fetchFavoriteShops(
          coords.longitude,
          coords.latitude,
          page
      );

      if (!response || !Array.isArray(response.value)) return;

      const shops = response.value;
      const updatedShops: ShopPreviewProps[] = [...currentShops, ...shops];

      setDiscoverShopsFilter3(updatedShops);
      if(response.pagination.hasMore) {
        setDiscoverPage3(response.pagination.nextPage);
      } else {
        setDiscoverPage3(-1);
      }
    }
  };

  // Fetch Map Shops
  const setMapPageShops = async () => {
      setFetchingPage2(true);
      const response = await fetchRadiusShops(region.longitude, region.latitude);
      setFetchingPage2(false);
      if (!response) {
        console.error("Invalid response: ", response);
        return;
      }
      const shops = response.value;

      setRadiusShops(shops);
   }


  // Active plans Request
  const fetchPlansPage1 = async (page: number = plansPage1): Promise<void> => {
    let currPlans = page>1? plans || [] : [];

    const response = await fetchUserPlans(
        userLocation?.latitude,
        userLocation?.longitude,
        10,
        page
    );

    const updatedShops = [...currPlans, ...response.value];

    setPlans(updatedShops)
    setPlansPage1(response.pagination.nextPage || page)
  }

  const fetchPlansPage2 = async (page: number = plansPage2): Promise<void> => {
    let currFavPlans = page>1? favoritePlans || [] : [];

    const response = await fetchUserLikedPlans(
        userLocation?.latitude,
        userLocation?.longitude,
        10,
        page
    );

    const updatedShops = [...currFavPlans, ...response.value];

    setFavoritePlans(updatedShops)
    setPlansPage2(response.pagination.nextPage || page)
  }

  const updateShopFavorite = (shop_id: string, isFav: boolean) => {
    setDiscoverShopsFilter1(prev =>
        prev ? prev.map(s => s.shop_id === shop_id ? { ...s, favorite: isFav } : s) : prev
    );
    setDiscoverShopsFilter2(prev =>
        prev ? prev.map(s => s.shop_id === shop_id ? { ...s, favorite: isFav } : s) : prev
    );
    setDiscoverShopsFilter3(prev =>
        prev ? prev.map(s => s.shop_id === shop_id ? { ...s, favorite: isFav } : s) : prev
    );
    setPlans(prev =>
        prev
            ? prev.map(p =>
                p.shop_id === shop_id
                    ? { ...p, favorite: isFav }
                    : p
            )
            : prev
    );
    setFavoritePlans(prev => {
      if (!prev) return prev;
      if (isFav) {
        const newlyFav = plans?.find(p => p.shop_id === shop_id ? { ...p, favorite: isFav } : p);
        return newlyFav ? [...prev.filter(p => p.shop_id !== shop_id ? { ...p, favorite: isFav } : p), newlyFav] : prev;
      } else {
        return prev.filter(p => p.shop_id !== shop_id);
      }
    });
  };

  return (
    <DataContext.Provider
      value={{
        fetchShopsByRadius: async (currRegion: regionProp) => {
          setRegion(currRegion);
          await setMapPageShops();
        },
        fetchDiscoverShops: async (
          filterOption: number,
          refresh: boolean
        ): Promise<void> => {

          setFetchingPage1(true);

          try {
            switch (filterOption) {
              case 0:
                await fetchDiscoverPage1(refresh? 1 : undefined);
                setFetchingPage1(false);
                break;
              case 1:
                await fetchDiscoverPage2(refresh? 1 : undefined);
                setFetchingPage2(false);
                break;
              case 2:
                await fetchDiscoverPage3(refresh? 1 : undefined);
                setFetchingPage3(false);
                break;
              default:
                throw new Error("Invalid filter option");
            }
          } catch (error) {
            console.error("Error fetching shops:", error);
          }
          setFetchingPage1(false);
        },
        fetchPlans: async (filterOption:number, refresh:boolean): Promise<void> => {
          setFetchingPage3(true);
          try {
            switch (filterOption) {
              case 0:
                await fetchPlansPage1(refresh? 1 : undefined);
                setFetchingPage1(false);
                break;
              case 1:
                await fetchPlansPage2(refresh? 1 : undefined);
                setFetchingPage1(false);
                break;
              default:
                throw new Error("Invalid filter option");
            }
          } catch (error) {
            console.error("Error fetching shops:", error);
          }
          setFetchingPage3(false);
        },

        fetchProfile: async () => {
          const profile = await fetchUser();
          setProfile(profile);
          return profile;
        },
        setRegion: async (location: regionProp) => {
          setRegion(location);
        },
        locateMe: async (map: React.RefObject<Map>) => {
          await rebaseUserLocation(map);
        },
        radiusShops,
        discoverShopsFilter1,
        discoverShopsFilter2,
        discoverShopsFilter3,
        plans: plans,
        favoritePlans: favoritePlans,
        updateShopFavorite: async (shop_id, isFav) => updateShopFavorite(shop_id, isFav),
        region,
        profile,
        userLocation,
        isPage1Loading: fetchingPage1,
        isPage2Loading: fetchingPage2,
        isPage3Loading: fetchingPage3,
        isPage4Loading: fetchingPage4,
        fetchAppConfig: async () => {
          setAppConfig(appConfig);
          return appConfig;
        },
        fetchNearestShopResult: async (shop_name: string) => {
          let coords = userLocation;
          if (!coords) {
            const location = await getCurrentLocation();
            if (location) {
              coords = location;
            }
          }
          if (coords) {
            setFetchingPage1(true);
            const prevShops = discoverShopsFilter1;
            setDiscoverShopsFilter1([]);
            const result = await fetchSearchedShop(
              shop_name,
              coords.longitude,
              coords.latitude
            );
            setIsShopSearched(true);
            setFetchingPage1(false);

            const shop = result.nearestShop;
            if (!shop) {
              alert("", "Invalid shop", "error");
              setDiscoverShopsFilter1(prevShops);
              return;
            }
            setDiscoverShopsFilter1([shop]);
          }
        },
        appConfig,
        isShopSearched
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
