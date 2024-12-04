export default () => {
  const isProd = process.env.APP_ENV === 'prod';

  return {
    name: 'MyRewards',
    slug:'myrewardsapp',
    ios: {
      bundleIdentifier: isProd ? 'com.my.app' : 'com.anonymous.myRewards',
      icon: './assets/images/MyRewardsLogo1.png',
      runtimeVersion: "1.0.0",
    },
    extra: {
      eas: {
        projectId: isProd
          ? "988bf54c-1d84-4d0b-a539-7be1ee48f0dd"
          : "4e3dda5a-96f6-4d5f-89fe-af470de180a8",
      },
    },
    owner: "myrewards",
    updates: {
      url: isProd
        ? "https://u.expo.dev/988bf54c-1d84-4d0b-a539-7be1ee48f0dd"
        : "https://u.expo.dev/4e3dda5a-96f6-4d5f-89fe-af470de180a8",
    },
    runtimeVersion: "1.0.0",
    android: {
      package: "com.anonymous.myRewards",
      icon: './assets/images/MyRewardsLogo1.png',
      runtimeVersion: "1.0.0"
    },
  };
};
