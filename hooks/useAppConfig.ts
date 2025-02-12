import {useState, useEffect} from 'react'
import {fetchAppConfig} from '@/services/fetchConfig';

type AppConfig = {
  isBeta: boolean;
}
export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);

    
    useEffect(() => {
        const getConfig = async () => {
          const data = await fetchAppConfig();
          const stringifiedData = JSON.stringify(data)
          const parsedData = JSON.parse(stringifiedData);
          setConfig(parsedData);
        };
        getConfig();
      }, []);

      return config;
}