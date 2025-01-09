import { ResourcesConfig } from "aws-amplify"
import Constants from 'expo-constants';

const { userPoolId, webClientId, cognitoDomain, identityPoolId, awsRegion, appEnv } = Constants.expoConfig?.extra || {};
console.log(appEnv)
export const amplifyConfiguration:ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: webClientId,
      userPoolId: userPoolId,
      identityPoolId: identityPoolId,
      loginWith: { 
        oauth: {
          domain: appEnv === 'dev' ? `user.beta.auth.myrewards.website`:`user.auth.myrewards.website`,
          scopes: ['openid','email','profile'],
          redirectSignIn: ['exp://127.0.0.1:19000/--/', 'myrewards://'],
          redirectSignOut: ['exp://127.0.0.1:19000/--/', 'myrewards://'],
          responseType: 'code',
          providers: ['Google'] 
        },
        email: true,
        phone: false,
      },
    }
  }
}