import { localData } from "@/app-data/appData";
import { ShopHour } from "@/app-data/data-types";

export const getShopStatus = (shop_hours:ShopHour[]|null) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const now = new Date();
  const currentDay = daysOfWeek[now.getDay()];
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const todayHours = shop_hours?.find((day) => day.day === currentDay);

  if (!todayHours || todayHours.open === null || todayHours.close === null) {
    return {status:`Closed`, hours:null};
  }
  else if (currentTime < todayHours.open) {
    return {status:`Closed`, hours:null};
  }
  else if (currentTime >= todayHours.close) {
    return {status:`Closed`, hours:null};
  }
  else return {status:`Open`, hours:todayHours};

};
  
export const convertTo12HourFormat = (time:string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};
  
export const calculateDistance = (
  lat: number,
  lon: number,
  userLocation: { latitude: number; longitude: number } | null
): string => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  if (!userLocation) return '';

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(userLocation.latitude - lat);
  const dLon = toRadians(userLocation.longitude - lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat)) *
      Math.cos(toRadians(userLocation.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInKm = R * c;
  const distanceInMiles = distanceInKm * 0.621371;

  return `${Math.round(distanceInMiles * 10) / 10}`;
};