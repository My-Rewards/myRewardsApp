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

export function localData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}

export function AppData({
  children,
  userSub,
}: PropsWithChildren<{ userSub: string }>) {
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
  const [savedFilterSelection, setSavedFilterSelection] = useState<"nearby" | "popular" | "favorite">("nearby");
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

  async function bootstrap() {
    await Promise.all([
      await fetchProfile(),
      await fetchAppConfig(),
      fetchDiscover("nearby"),
      fetchDiscover("popular"),
      fetchDiscover("favorite"),
      fetchMapShops(),
      fetchPlans(),
      fetchFavoritePlans(),
    ]);
  }

  async function getCurrentLocation(): Promise<regionProp | undefined> {
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

  async function locateMe(mapRef: React.RefObject<MapView>) {
    const coords = userLocation ?? (await getCurrentLocation());
    if (coords && mapRef.current) mapRef.current.animateToRegion(coords, 300);
  }

  async function fetchProfile(): Promise<Profile> {
    setIsLoadingProfile(true);
    try {
      const data = await fetchUser();
      setProfile(data);
      return data;
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function fetchAppConfig(): Promise<AppConfig> {
    const config = await apiFetchAppConfig();
    setAppConfig(config);
    return config;
  }

  async function fetchDiscover(
    filter: "nearby" | "popular" | "favorite",
    refresh = false
  ) {
    try {
      const coords = userLocation ?? (await getCurrentLocation());
      if (!coords) return;
      const page = refresh ? 1 : pagination.current[filter];
      let resp: { value: ShopPreviewProps[]; pagination: { nextPage: number } };
      if (filter === "nearby") {
        if(pagination.current.nearby === -1) return;
        resp = await fetchNearbyShops(coords.longitude, coords.latitude, page);
        if(!resp.value && Array.isArray(resp)) {
          console.error("No shops found");
        }
        setDiscoverNearby((prev) =>
          refresh ? resp.value : [...prev, ...resp.value]
        );
      } else if (filter === "popular") {
        if(pagination.current.popular === -1) return;
        resp = await fetchPopularShops(coords.longitude, coords.latitude, page);
        if(!resp.value && Array.isArray(resp)) {
          console.error("No shops found");
        }
        setDiscoverPopular((prev) =>
          refresh ? resp.value : [...prev, ...resp.value]
        );
      } else {
        if(pagination.current.favorite === -1) return;
        resp = await fetchFavoriteShops(
          coords.longitude,
          coords.latitude,
          page
        );
        if(!resp.value && Array.isArray(resp)) {
          console.error("No shops found");
        }
        setDiscoverFavorite((prev) =>
          refresh ? resp.value : [...prev, ...resp.value]
        );
      }
      pagination.current[filter] = resp.pagination.nextPage ?? -1;
    } catch (e) {
      console.error(e);
    }
  }

  async function searchShop(shopName: string) {
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
      }
      setIsShopSearched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDiscover(false);
    }
  }

  async function fetchMapShops() {
    setIsLoadingMap(true);
    try {
      const resp = await fetchRadiusShops(region.longitude, region.latitude);
      setRadiusShops(resp.value);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMap(false);
    }
  }

  async function fetchPlans(refresh = false) {
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPlans(false);
    }
  }

  async function fetchFavoritePlans(refresh = false) {
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPlans(false);
    }
  }

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
        setSavedFilterSelection,
        savedFilterSelection,
        setIsLoadingDiscover,
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
  fetchProfile: () => Promise<Profile>;
  fetchAppConfig: () => Promise<AppConfig>;
  fetchDiscover: (
    filter: "nearby" | "popular" | "favorite",
    refresh?: boolean
  ) => Promise<void>;
  searchShop: (shopName: string) => Promise<void>;
  fetchMapShops: () => Promise<void>;
  fetchPlans: (refresh?: boolean) => Promise<void>;
  fetchFavoritePlans: (refresh?: boolean) => Promise<void>;
  setSavedFilterSelection: (filter:  "nearby" | "popular" | "favorite") => void;
  savedFilterSelection: "nearby" | "popular" | "favorite";
  setFilterNumber: (filter: 0 | 1 | 2) => void;
  filterNumber: number;
};