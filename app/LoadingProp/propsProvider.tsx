import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { loadingScreen } from './loadingScreen';
import { useAlert } from './alert';
import { scanStatusProp} from "@/app/LoadingProp/scanStatus";

/* 
  Hub of in-app functionality props
*/

const PropsContext = createContext<{
    /**
   * Function to trigger a loading overLay.
   * @param isLoading - Determines whether the loading screen is visible.
   */
  triggerLoadingScreen: ({ isLoading }: { isLoading: boolean }) => void,

    /**
   * Function for in-app status alerts
   * @param title - The title of the alert.
   * @param description - The description of the alert.
   * @param status - The status of the alert, either "error" or "success".   
   */
  alert: (title: string, description: string, status:'error'|'success') => void;
  scanStatus: (success:boolean) => void;
}>({
  triggerLoadingScreen: async () => null,
  alert: async () => null,
  scanStatus: async () => null
});

export const PropsProvider = ({ children }: { children: ReactNode }) => {
  const { triggerLoadingScreen, LoadingModal } = loadingScreen();
  const { alert, AlertModal } = useAlert();
  const { scanStatus, StatusModal } = scanStatusProp();


  return (
    <PropsContext.Provider value={{triggerLoadingScreen, alert, scanStatus}}>
      {children}
      {LoadingModal}
      {AlertModal}
      {StatusModal}
    </PropsContext.Provider>
  );
};

export const useProps = () => useContext(PropsContext);

export default PropsProvider;