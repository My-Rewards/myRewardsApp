import { fetchAppConfig } from "@/APIs/fetchConfig";

export const useAppConfig = async () => {
  const data = await fetchAppConfig();
  if (!data) {
    return null;
  }
  const stringifiedData = JSON.stringify(data);
  const parsedData = JSON.parse(stringifiedData);

  return parsedData;
};