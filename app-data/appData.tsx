import React, {
  useContext,
  createContext,
  PropsWithChildren,
  useState,
  useEffect,
  useRef,
} from "react";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { useProps } from "@/app/LoadingProp/propsProvider";
import type {
  PreviewPlanProp,
  Profile,
  regionProp,
  ShopPreviewProps,
  AppConfig,
  mapPinProps,
} from "./data-types";
import fetchUser from "@/APIs/ProfileAPIs/fetchUser";
import { fetchAppConfig as apiFetchAppConfig } from "@/APIs/ExternalAPIs/fetchConfig";
import { fetchPopularShops } from "@/APIs/DiscoverAPIs/fetchPopularShops";
import { fetchNearbyShops } from "@/APIs/DiscoverAPIs/discoverShops";
import { fetchFavoriteShops } from "@/APIs/DiscoverAPIs/fetchFavoriteShops";
import { fetchSearchedShop } from "@/APIs/DiscoverAPIs/fetchSearchedShop";
import { fetchRadiusShops } from "@/APIs/MapAPIs/fetchRadiusShops";
import {
  fetchUserPlans,
  fetchUserLikedPlans,
} from "@/APIs/PlanAPIs/fetchUserPlans";

const DataContext = createContext<AppDataContextType | undefined>(undefined);

export const localData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}

export const AppData = ({
  children,
  userSub,
}: PropsWithChildren<{ userSub: string }>) => {
  const { alert } = useProps();

  //State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [userLocation, setUserLocation] = useState<regionProp | null>(null);
  const [region, setRegion] = useState<regionProp>({
    latitude: 28.5384,
    longitude: -81.3789,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [radiusShops, setRadiusShops] = useState<mapPinProps[]>([]);
  const [discoverNearby, setDiscoverNearby] = useState<ShopPreviewProps[]>([]);
  const [discoverPopular, setDiscoverPopular] = useState<ShopPreviewProps[]>(
    []
  );
  const [discoverFavorite, setDiscoverFavorite] = useState<ShopPreviewProps[]>(
    []
  );
  const [filterNumber, setFilterNumber] = useState<0 | 1 | 2>(0);
  const [plans, setPlans] = useState<PreviewPlanProp[]>([]);
  const [favoritePlans, setFavoritePlans] = useState<PreviewPlanProp[]>([]);
  const [isShopSearched, setIsShopSearched] = useState(false);

  //Loading flags
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingDiscover, setIsLoadingDiscover] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  //Pagination tracker
  const pagination = useRef({
    nearby: 1,
    popular: 1,
    favorite: 1,
    plans: 1,
    liked: 1,
  });

  //Init
  useEffect(() => {
    getCurrentLocation().catch(console.error);
  }, []);
  useEffect(() => {
    if (userLocation) bootstrap();
  }, [userLocation]);

  const bootstrap = async() => {
    await Promise.all([
      await fetchProfile(),
      await fetchAppConfig(),
      fetchDiscover(0, true),
      fetchDiscover(1, true),
      fetchDiscover(2, true),
      fetchMapShops(),
      fetchPlans(),
      fetchFavoritePlans(),
    ]);
  }

  const getCurrentLocation = async(): Promise<regionProp | undefined> => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setUserLocation(coords);
      setRegion(coords);
      return coords;
    } catch {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (perm.status !== "granted")
          alert("", "Enable access to your location in Settings", "error");
      }
    }
  }

  const locateMe = async(mapRef: React.RefObject<MapView>) => {
    const coords = userLocation ?? (await getCurrentLocation());
    if (coords && mapRef.current) mapRef.current.animateToRegion(coords, 300);
  }

  const fetchProfile = async(): Promise<Profile | undefined>  =>{
    setIsLoadingProfile(true);
    try {
      const data = await fetchUser();
      setProfile(data);
      return data;
    }  catch {
      console.error("Error fetching profile");
    }
      finally {
      setIsLoadingProfile(false);
    }
  }

  const fetchAppConfig = async(): Promise<AppConfig | undefined> =>{
   try{
     const config = await apiFetchAppConfig();
     setAppConfig(config);
     return config;
   } catch {
    console.error("Error fetching app config");
   }
  }

  const fetchDiscover = async(
    filter: 0 | 1 | 2,
    refresh = false
  ) => {
    let page;
    let fn;
    switch (filter) {
      case 0:
        page = refresh ? 1 : pagination.current.nearby;
        fn = fetchNearbyShops;
        break;
      case 1:
        page = refresh ? 1 : pagination.current.popular;
        fn = fetchPopularShops;
        break;
      case 2:
        page = refresh ? 1 : pagination.current.favorite;
        fn = fetchFavoriteShops;
        break;
      default:
        console.error("Invalid filter");
        return;
    }
    try {
      if (page === -1) return;
      if(refresh) {
        setIsLoadingDiscover(true);
      }
      const coords = userLocation ?? (await getCurrentLocation());
      if (!coords) return;
      const resp = await fn(
        coords.longitude,
        coords.latitude,
        page,
      );
      if (!resp.value && !Array.isArray(resp)) {
        console.error("No shops found");
      }
      if (filter === 0) {
        setDiscoverNearby((prev) => (refresh ? resp.value : [...prev, ...resp.value]));
        pagination.current.nearby = resp.pagination.nextPage ?? -1;
      } else if (filter === 1) {
        setDiscoverPopular((prev) => (refresh ? resp.value : [...prev, ...resp.value]));
        pagination.current.popular = resp.pagination.nextPage ?? -1;
      } else {
        setDiscoverFavorite((prev) => (refresh ? resp.value : [...prev, ...resp.value]));
        pagination.current.favorite = resp.pagination.nextPage ?? -1;
      }
  } catch {
    console.error("Error fetching discover data");
  } finally {
    setIsLoadingDiscover(false);
  }
}

  const searchShop = async(shopName: string) => {
    setIsLoadingDiscover(true);
    try {
      const coords = userLocation ?? (await getCurrentLocation());
      if (!coords) return;
      const resp = await fetchSearchedShop(
        shopName,
        coords.longitude,
        coords.latitude
      );
      if (!resp.nearestShop) {
        alert("", "Shop not found", "error");
      } else {
        setDiscoverNearby([resp.nearestShop]);
        pagination.current.nearby = -1;
      }
      setIsShopSearched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDiscover(false);
    }
  }

  const fetchMapShops = async() => {
    setIsLoadingMap(true);
    try {
      const resp = await fetchRadiusShops(region.longitude, region.latitude);
      setRadiusShops(resp.value);
    } catch {
      console.error("Error fetching map shops");
    } finally {
      setIsLoadingMap(false);
    }
  }

  const fetchPlans = async(refresh = false) => {
    if(pagination.current.plans === -1) return; 
    if(refresh){
      setIsLoadingPlans(true);
    }
    try {
      const page = refresh ? 1 : pagination.current.plans;
      const resp = await fetchUserPlans(
        userLocation?.latitude,
        userLocation?.longitude,
        10,
        page
      );
      if(!resp.value && !Array.isArray(resp)) {
        console.error("No plans found");
      }
      setPlans((prev) => (refresh ? resp.value : [...prev, ...resp.value]));
      pagination.current.plans = resp.pagination.nextPage ?? -1;
    } catch {
      console.error("Error fetching plans");
    } finally {
      setIsLoadingPlans(false);
    }
  }

  const fetchFavoritePlans = async(refresh = false) => {
    if(pagination.current.liked === -1) return;
    setIsLoadingPlans(true);
    try {
      const page = refresh ? 1 : pagination.current.liked;
      const resp = await fetchUserLikedPlans(
        userLocation?.latitude,
        userLocation?.longitude,
        10,
        page
      );
      if(!resp.value && !Array.isArray(resp)) {
        console.error("No favorite plans found");
      }
      setFavoritePlans((prev) => (refresh ? resp.value : [...prev, ...resp.value]));
      pagination.current.liked = resp.pagination.nextPage ?? -1;
    } catch {
      console.error("Error fetching favorite plans");
    } finally {
      setIsLoadingPlans(false);
    }
  }

  const updateShopFavorite = (shop_id: string, isFav: boolean) => {
    setDiscoverNearby((prev) =>
      prev.map((s) =>
        s.shop_id === shop_id ? { ...s, favorite: isFav } : s
      )
    );
    setDiscoverPopular((prev) =>
      prev.map((s) =>
        s.shop_id === shop_id ? { ...s, favorite: isFav } : s
      )
    );
    setDiscoverFavorite((prev) =>
      prev.map((s) =>
        s.shop_id === shop_id ? { ...s, favorite: isFav } : s
      )
    );

    setPlans((prev) =>
      prev.map((p) =>
        p.shop_id === shop_id ? { ...p, favorite: isFav } : p
      )
    );
    setFavoritePlans((prev) => {
      if (isFav) {
        const newly = plans.find((p) => p.shop_id === shop_id);
        return newly
          ? [...prev.filter((p) => p.shop_id !== shop_id), { ...newly, favorite: true }]
          : prev;
      } else {
        return prev.filter((p) => p.shop_id !== shop_id);
      }
    });
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        appConfig,
        userLocation,
        region,
        radiusShops,
        discoverNearby,
        discoverPopular,
        discoverFavorite,
        plans,
        favoritePlans,
        isShopSearched,
        isLoadingProfile,
        isLoadingDiscover,
        isLoadingMap,
        isLoadingPlans,
        locateMe,
        setRegion,
        fetchProfile,
        fetchAppConfig,
        fetchDiscover,
        searchShop,
        fetchMapShops,
        fetchPlans,
        fetchFavoritePlans,
        setIsLoadingDiscover,
        updateShopFavorite,
        filterNumber,
        setFilterNumber,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

type AppDataContextType = {
  profile: Profile | null;
  appConfig: AppConfig | null;
  userLocation: regionProp | null;
  region: regionProp;
  radiusShops: mapPinProps[];
  discoverNearby: ShopPreviewProps[];
  discoverPopular: ShopPreviewProps[];
  discoverFavorite: ShopPreviewProps[];
  plans: PreviewPlanProp[];
  favoritePlans: PreviewPlanProp[];
  isShopSearched: boolean;
  isLoadingProfile: boolean;
  isLoadingDiscover: boolean;
  setIsLoadingDiscover: (loading: boolean) => void;
  isLoadingMap: boolean;
  isLoadingPlans: boolean;
  locateMe: (mapRef: React.RefObject<MapView>) => Promise<void>;
  setRegion: (location: regionProp) => void;
  fetchProfile: () => Promise<Profile | undefined>;
  fetchAppConfig: () => Promise<AppConfig | undefined>;
  fetchDiscover: (
    filter: 0 | 1 | 2,
    refresh?: boolean
  ) => Promise<void>;
  searchShop: (shopName: string) => Promise<void>;
  fetchMapShops: () => Promise<void>;
  fetchPlans: (refresh?: boolean) => Promise<void>;
  fetchFavoritePlans: (refresh?: boolean) => Promise<void>;
  setFilterNumber: (filter: 0 | 1 | 2) => void;
  filterNumber: 0 | 1 | 2;
  updateShopFavorite: (shop_id: string, isFav: boolean) => void;
};