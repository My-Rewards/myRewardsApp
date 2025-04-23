import {
  mockDiscoverShops,
  mockFavoriteShops,
  mockPopularShops,
  // mockProfile,
  mockShopRadius,
} from "@/APIs/api";
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
} from "./data-types";
import Map from "react-native-maps";
import fetchUser from "@/APIs/fetchUser";
import { fetchAppConfig } from "@/APIs/fetchConfig";
import { set } from "zod";
import { fetchNearbyShops } from "@/APIs/discoverShops";
import { fetchRadiusShops } from "@/APIs/fetchRadiusShops";
import { fetchUserPlans } from "@/APIs/fetchUserPlans";
import { fetchSearchedShop } from "@/APIs/fetchSearchedShop";

const DataContext = createContext<{
  fetchShopsByRadius: (currRegion: regionProp) => void;
  fetchDiscoverShops: (filterOption: number, pagination: number) => void;
  fetchNearestShopResult: (shop_name: string) => void;
  fetchPlans: () => void;
  fetchProfile: () => void;
  locateMe: (map: React.RefObject<Map>) => void;
  setRegion: (location: regionProp) => void;
  region: regionProp;
  radiusShops?: ShopPreviewProps[] | null;
  discoverShopsFilter1?: ShopPreviewProps[] | null;
  discoverShopsFilter2?: ShopPreviewProps[] | null;
  discoverShopsFilter3?: ShopPreviewProps[] | null;
  shopPreviewCache?: ShopPreviewProps | null;
  profile?: Profile | null;
  plans?: PreviewPlanProp[] | null;
  favoritePlans?: PreviewPlanProp[] | null;
  isPage1Loading: boolean;
  isPage2Loading: boolean;
  isPage3Loading: boolean;
  isPage4Loading: boolean;
  userLocation: regionProp | null;
  fetchAppConfig: () => Promise<AppConfig | null>;
  appConfig: AppConfig | null;
  pageNumber1: number;
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
  isPage1Loading: false,
  isPage2Loading: false,
  isPage3Loading: false,
  isPage4Loading: false,
  userLocation: null,
  fetchAppConfig: async () => null,
  appConfig: null,
  pageNumber1: 1,
  isShopSearched: false,
});

export function localData() {
  const value = useContext(DataContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("appData must be wrapped in a <localData />");
    }
  }
  return value;
}

export function AppData({
  children,
  userSub,
}: PropsWithChildren & { userSub: string }) {
  const { alert } = useProps();
  const [radiusShops, setRadiusShops] = useState<ShopPreviewProps[] | null>();
  const [profile, setProfile] = useState<Profile | null>();
  const [userLocation, setUserLocation] = useState<regionProp | null>(null);
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  const [plans, setPlans] = useState<PreviewPlanProp[] | null>();
  const [favoritePlans, setFavoritePlans] = useState<
    PreviewPlanProp[] | null
  >();
  const [pageNumber1, setPageNumber1] = useState(1);

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

        if (!appConfig) {
          // const appConfig = await fetchAppConfig();
          // if (!appConfig) {
          //   return null;
          // }
          setAppConfig(appConfig);
        }

        if (
          !(
            discoverShopsFilter1 ||
            discoverShopsFilter2 ||
            discoverShopsFilter3
          )
        ) {
          setFetchingPage2(true);
          try {
            // Replace mock API with actual API
            // set discover and maps to same value because theyre identical upon load until we figure more optimal method
            // const shops1 = await mockDiscoverShops(userSub, region)
            // setDiscoverShopsFilter1(shops1);
            // setRadiusShops(shops1);
            await setDiscoverShopsPage1(pageNumber1);
            await setMapPageShops();
            const shops2 = await mockPopularShops(userSub, 0, region);
            setDiscoverShopsFilter2(shops2);
            const shops3 = await mockFavoriteShops(userSub, 0, region);
            setDiscoverShopsFilter3(shops3);
          } catch (error) {
            console.error("Error fetching discover shops:", error);
          } finally {
            setFetchingPage2(false);
          }
        }

        if (!plans) {
          setFetchingPage4(true);
          try {
            // Replace mock API with actual API
            const plansData = await fetchUserPlans();
            setPlans(plansData);

            // find favorites and set it
            setFavoritePlans([]);
          } catch (error) {
            console.error("Error fetching plans:", error);
          } finally {
            setFetchingPage4(false);
          }
        }
      } catch (error) {
        console.error("Error in fetchData sequence:", error);
      }
    };

    fetchData(); // Call the async function
  }, []);

  async function getCurrentLocation() {
    setFetchingPage2(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        mayShowUserSettingsDialog: true,
      });
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setRegion({
        latitude: coords.longitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      return coords;
    } catch (error) {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== "granted") {
          alert("", "Enable Access to your Location in Settings", "error");
          return;
        }
      }
    } finally {
      setFetchingPage2(false);
    }
  }

  async function rebaseUserLocation(map: React.RefObject<Map>) {
    const coords = await getCurrentLocation();
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
  }

  const setDiscoverShopsPage1 = async (page: number): Promise<void> => {
    let coords = userLocation;
    if (!coords) {
      const location = await getCurrentLocation();
      if (location) {
        coords = location;
        setUserLocation(location);
        setRegion(location);
      }
    }

    if (coords) {
      let currentShops = discoverShopsFilter1 || [];  
      if(isShopSearched){
        setIsShopSearched(false);
        currentShops = [];
      }
      const response = await fetchNearbyShops(
        coords.longitude,
        coords.latitude,
        page
      );

      if (!response || !Array.isArray(response.value)) {
        console.error(
          "Expected an array of shops in response.value, but got:",
          response
        );
        return;
      }
      const shops = response.value;

      const discoverShopsPage1Array = [];
      for (const shop of shops) {
        const shopSchema: ShopPreviewProps = {
          id: shop.id,
          organization_id: shop.organization_id,
          shop_id: shop.shop_id,
          name: shop.name,
          preview: shop.preview,
          latitude: shop.latitude,
          longitude: shop.longitude,
          distance: shop.distance,
          favorite: shop.favorite,
          location: {
            city: shop.location.city,
            address: shop.location.address,
            state: shop.location.state,
          },
          shop_hours: shop.shop_hours,
        };
        discoverShopsPage1Array.push(shopSchema);
      }
      const updatedShops = [...currentShops, ...discoverShopsPage1Array];

      setDiscoverShopsFilter1(updatedShops);

      setPageNumber1(page + 1);
    }
  };

  const setMapPageShops = async () => {
    let coords = userLocation;
    if (!coords) {
      const location = await getCurrentLocation();
      if (location) {
        coords = location;
      }
      if (coords) {
        const response = await fetchRadiusShops(
          coords.longitude,
          coords.latitude
        );

        if (!response || !Array.isArray(response.value)) {
          console.error(
            "Expected an array of shops in response.value, but got:",
            response
          );
          return;
        }
        const shops = response.value;

        const radiusShopsArray = [];
        for (const shop of shops) {
          const shopSchema: ShopPreviewProps = {
            id: shop.id,
            organization_id: shop.organization_id,
            shop_id: shop.shop_id,
            name: shop.name,
            preview: shop.preview,
            latitude: shop.latitude,
            longitude: shop.longitude,
            distance: shop.distance,
            favorite: shop.favorite,
            location: {
              city: shop.location.city,
              address: shop.location.address,
              state: shop.location.state,
            },
            shop_hours: shop.shop_hours,
          };
          radiusShopsArray.push(shopSchema);
        }
        setRadiusShops(shops);
      }
    }
  };
  return (
    <DataContext.Provider
      value={{
        fetchShopsByRadius: async (currRegion: regionProp) => {
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
          await setMapPageShops();
        },
        fetchDiscoverShops: async (
          filterOption: number,
          pagination: number
        ): Promise<void> => {
          // Fetch + Update shops DiscoverShops given closet/popularity
          // You NEED to filter by distance regardless (a shop 300 miles away is useless to a user)
          setFetchingPage1(true);
          try {
            switch (filterOption) {
              case 0:
                // const shop1 = await mockDiscoverShops(userSub, region)
                // setDiscoverShopsFilter1(shop1)
                // setFetchingPage1(false)
                await setDiscoverShopsPage1(pagination);
                setFetchingPage1(false);
                break;
              case 1:
                const shops2 = await mockPopularShops(
                  userSub,
                  pagination,
                  region
                );
                if (pagination > 0) {
                  setDiscoverShopsFilter2((prevShops) => [
                    ...(prevShops || []),
                    ...shops2,
                  ]);
                } else {
                  setDiscoverShopsFilter2(shops2);
                }
                setFetchingPage1(false);
                break;
              case 2:
                const shop3 = await mockFavoriteShops(
                  userSub,
                  pagination,
                  region
                );
                if (pagination > 0) {
                  setDiscoverShopsFilter3((prevShops) => [
                    ...(prevShops || []),
                    ...shop3,
                  ]);
                } else {
                  setDiscoverShopsFilter3(shop3);
                }
                setFetchingPage1(false);
                break;
              default:
                throw new Error("Invalid filter option");
            }
          } catch (error) {
            console.error("Error fetching shops:", error);
          }
        },
        fetchPlans: async () => {
          setFetchingPage3(true);

          try {
            const fetchedPlans = await fetchUserPlans();
            setPlans(fetchedPlans);
            setFavoritePlans(fetchedPlans);
          } catch (error) {}
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
            const result = await fetchSearchedShop(
              shop_name,
              coords.longitude,
              coords.latitude
            );
            setIsShopSearched(true);
            setFetchingPage1(false);
            setPageNumber1(1);
            const shop = result.nearestShop;
            const shopSchema: ShopPreviewProps = {
              id: shop.id,
              organization_id: shop.organization_id,
              shop_id: shop.shop_id,
              name: shop.name,
              preview: shop.preview,
              latitude: shop.latitude,
              longitude: shop.longitude,
              distance: shop.distance,
              favorite: shop.favorite,
              location: {
                city: shop.location.city,
                address: shop.location.address,
                state: shop.location.state,
              },
              shop_hours: shop.shop_hours,
            };

            setDiscoverShopsFilter1([shopSchema]);
          }
        },
        appConfig,
        pageNumber1,
        isShopSearched
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
