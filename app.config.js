export default () => {
    
    return {
      name: process.env.APP_ENV === 'production' ? 'myRewards' : 'myRewards (DEV)',
      ios: {
        bundleIdentifier: process.env.APP_ENV === 'production' ? 'com.my.app' : 'com.anonymous.myRewards',
      },
      extra: {
        eas: {
          projectId: "e06129e6-3069-486e-8da0-02654828d330"
        }
      }
    };
  };
  