export default () => {
    const isProd = process.env.APP_ENV === 'prod';

    if(!isProd){
        return {
            name: 'myRewardsApp',
            ios: {
              bundleIdentifier: isProd ? 'com.my.app' : 'com.anonymous.myRewards',
            },
            extra: {
              eas: {
                projectId: "4e3dda5a-96f6-4d5f-89fe-af470de180a8"
              }
            },
            owner: "myrewards",
            updates: {
                "url": "https://u.expo.dev/4e3dda5a-96f6-4d5f-89fe-af470de180a8"
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
            name: 'myRewardsApp-Prod',
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
                "url": "https://u.expo.dev/988bf54c-1d84-4d0b-a539-7be1ee48f0dd"
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
  