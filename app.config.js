export default () => {
    const isProd = process.env.APP_ENV === 'production';

    if(!isProd){
        return {
            name: 'myRewards',
            ios: {
              bundleIdentifier: isProd ? 'com.my.app' : 'com.anonymous.myRewards',
            },
            extra: {
              eas: {
                projectId: "e06129e6-3069-486e-8da0-02654828d330"
              }
            },
            owner: "myrewards",
            updates: {
                "url": "https://u.expo.dev/e06129e6-3069-486e-8da0-02654828d330"
              },
              runtimeVersion: {
                "policy": "appVersion"
              },
              android: {
                "runtimeVersion": {
                  "policy": "appVersion"
                }
              },
              ios: {
                "runtimeVersion": "1.0.0"
              }
          };

    }else{
        return {
            name: 'myRewards-Prod',
            ios: {
              bundleIdentifier: isProd ? 'com.my.app' : 'com.anonymous.myRewards',
            },
            extra: {
              eas: {
                projectId: "988bf54c-1d84-4d0b-a539-7be1ee48f0dd"
              }
            },
            owner: "myrewards",
            updates: {
                "url": "https://u.expo.dev/e06129e6-3069-486e-8da0-02654828d330"
              },
            runtimeVersion: {
                "policy": "appVersion"
              },
              android: {
                "runtimeVersion": {
                  "policy": "appVersion"
                }
              },
              ios: {
                "runtimeVersion": "1.0.0"
              }
          };
    }
  };
  