import {useState, useEffect} from 'react'
import {fetchAppConfig} from '@/services/fetchConfig';

export const useAppConfig = () => {
    const [config, setConfig] = useState(null);

    
    useEffect(() => {
        const getConfig = async () => {
          const data = await fetchAppConfig();
          setConfig(data);
        };
        getConfig();
      }, []);

      return config;
}