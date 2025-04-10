import { ResourcesConfig } from "aws-amplify"
import Constants from 'expo-constants';

const { userPoolId, webClientId, identityPoolId, appEnv } = Constants.expoConfig?.extra || {};

export const amplifyConfiguration:ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: webClientId,
      userPoolId: userPoolId,
      identityPoolId: identityPoolId,
      loginWith: { 
        oauth: {
          domain: appEnv === 'beta' ? `user.beta.auth.myrewards.website`:`user.auth.myrewards.website`,
          scopes: ['openid','email','profile'],
          redirectSignIn: appEnv === 'beta' 
            ? ['exp://127.0.0.1:19000/--/', 'myrewards://']
            : ['myrewards://', 'com.myrewards.app://'],
          redirectSignOut: appEnv === 'beta'
            ? ['exp://127.0.0.1:19000/--/', 'myrewards://']
            : ['myrewards://', 'com.myrewards.app://'],
          responseType: 'code',
          providers: ['Google'] 
        },
        email: true,
        phone: false,
      },
    }
  }
}