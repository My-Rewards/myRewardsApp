import { useContext, createContext, type PropsWithChildren, useState } from 'react';


const DataContext = createContext<{
    fetchShopsByRadius: (radius:number, location: {longitude:string, latitude:string}) => Promise<shop[]>; 
    fetchShopsByPopular: (location: {longitude:string, latitude:string}) => Promise<shop[]>; 
    filteredShops?: shops[] | null;
    shop?: shop | null;
    isLoading: boolean;
  }>({
    fetchShopsByRadius: async () => [],
    fetchShopsByPopular: async () => [],
    filteredShops: null,
    isLoading: false,
  });
  

  export function AppData({ children }: PropsWithChildren) {
    const [filteredShops, setFilteredShops] = useState<shops[]|null>();
    const [fetching, setFetching] = useState(false);
  
    return (
      <DataContext.Provider
        value={{
            fetchShopsByRadius: async (radius:number, location: {longitude:string, latitude:string}) => {
                return []
            },
            fetchShopsByPopular: async (location: {longitude:string, latitude:string}) => {
                return []
            },
            filteredShops,
            isLoading: fetching
        }}>
        {children}
      </DataContext.Provider>
    );
  }