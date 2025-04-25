require('dotenv').config();

export default () => {
  const isProd = process.env.APP_ENV == 'prod';
  const RUNTIMEVERSION = '1.0.0'
  let apiPath = "https://beta.api.myrewards.website"
  if(isProd) {
    apiPath = "https://api.myrewards.website"
  }
  return {
    name: 'MyRewards',
    slug:'myrewardsapp',
    scheme: "myrewards",
    plugins: [
      [
        "react-native-nfc-manager",
        {
          "nfcPermission": "MyRewards needs access to NFC scanning when using the app",
          "selectIdentifiers": ["D2760000850100","D2760000850101"],
          "systemCodes": ["8008", "8005", "0003", "fe00", "90b7", "927a","12FC","86a7"],
          "includeNdefEntitlement": false,
        },
      ],
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "DEFAULT"
        }
      ],
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#fffbf6",
          "image": './assets/images/logo-orange.png',
          "imageWidth": 200
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Allow MyRewards to use your location.",
          "isIosBackgroundLocationEnabled": false,
          "isAndroidBackgroundLocationEnabled": false
        }
      ],
      "expo-router"
    ],
    ios: {
      bundleIdentifier: 'com.myrewards.app',
      icon: './assets/images/MyRewardsLogo1.png',
      requireFullScreen: true,
      infoPlist: {
        UIBackgroundModes: [
          "location",
          "fetch",
          "remote-notification"
        ],
        "NSLocationWhenInUseUsageDescription": "This app requires access to your location when open.",
        "LSApplicationQueriesSchemes": ["tel"],
        "ITSAppUsesNonExemptEncryption": false,
        "NSLocationDefaultAccuracyReduced": false
      },
      config:{
        googleMapsApiKey:'AIzaSyAZyqCWWwjwJ6Oa6Qzp7EEWhwIwI7XJz8g'
      },
    },
    android: {
      package: isProd ? 'com.myrewards.app':'com.myrewards.app.dev',
      icon: './assets/images/MyRewardsLogo1.png',
      runtimeVersion: RUNTIMEVERSION
    },
    extra: {
      eas: {
        projectId: "4b2c2eb6-67bb-469c-b5ad-0d7c82b741b2"
      },
      cognitoDomain: isProd ? 'https://api.myrewards.website':'https://beta.api.myrewards.website',
      userPoolId: process.env.USERPOOL_ID,
      webClientId: process.env.WEB_CLIENT_ID,
      identityPoolId: process.env.IDENTITY_POOL_ID,
      awsRegion: process.env.AWS_REGION,
      appEnv: process.env.APP_ENV,
      appConfig: JSON.parse(process.env.APP_CONFIG_VALUES),
      apiPath: apiPath,
    },
    owner: "myrewards",
    updates: {
      url: "https://u.expo.dev/4b2c2eb6-67bb-469c-b5ad-0d7c82b741b2"
    },
    description: 'MyRewards Mobile App',
    runtimeVersion: {
      policy: "appVersion"
    },
    orientation:'default',
  };
};