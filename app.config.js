require('dotenv').config(); 

export default () => {
  const isProd = process.env.APP_ENV === 'prod';
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
      ]
    ],
    ios: {
      bundleIdentifier: isProd ? 'com.myRewards.website.prod' : 'com.myRewards.website.beta',
      icon: './assets/images/MyRewardsLogo1.png',
      runtimeVersion: RUNTIMEVERSION,
      requireFullScreen: true,
      infoPlist: {
        UIBackgroundModes: [
          "location",
          "fetch",
          "remote-notification"
        ],
        "NSLocationWhenInUseUsageDescription": "MyRewards needs access to you location when using the app.",
        "LSApplicationQueriesSchemes": ["tel"],
      },
      config:{
        googleMapsApiKey:'AIzaSyBmgtn62Neco3iFbjYKnWiVTSEYgRelDxk'
      },

    },
    android: {
      package: isProd ? 'com.myRewards.website.prod' : 'com.myRewards.website.beta',
      icon: './assets/images/MyRewardsLogo1.png',
      runtimeVersion: RUNTIMEVERSION
    },
    extra: {
      eas: {
        projectId: isProd
          ? "988bf54c-1d84-4d0b-a539-7be1ee48f0dd"
          : "4e3dda5a-96f6-4d5f-89fe-af470de180a8",
      },
      userPoolId: process.env.USERPOOL_ID,
      webClientId: process.env.WEB_CLIENT_ID,
      cognitoDomain: process.env.APP_ENV == 'prod' ? 'https://api.myrewards.website':'https://beta.api.myrewards.website',
      identityPoolId: process.env.IDENTITY_POOL_ID,
      awsRegion: process.env.AWS_REGION,
      appEnv: process.env.APP_ENV,
      appConfig: JSON.parse(process.env.APP_CONFIG_VALUES),
      apiPath: apiPath,
    },
    owner: "myrewards",
    updates: {
      url: isProd
        ? "https://u.expo.dev/988bf54c-1d84-4d0b-a539-7be1ee48f0dd"
        : "https://u.expo.dev/4e3dda5a-96f6-4d5f-89fe-af470de180a8",
    },
    runtimeVersion: "1.0.0",
    description: 'MyRrewards Mobile App',
    orientation:'default',
  };
};