import { ResourcesConfig } from "aws-amplify"

export const amplifyConfiguration:ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID||'',
      userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID||'',
      identityPoolId:process.env.EXPO_PUBLIC_IDENTITY_POOL_ID||'',
      loginWith: { 
        oauth: {
          domain: `${process.env.EXPO_PUBLIC_COGNITO_DOMAIN}.auth.us-east-1.amazoncognito.com`,
          scopes: ['openid','email','profile'],
          redirectSignIn: ['exp://127.0.0.1:19000/--/', 'myRewards://'],
          redirectSignOut: ['exp://127.0.0.1:19000/--/', 'myRewards://'],
          responseType: 'code',
          providers: ['Google'] 
        },
        email: true,
        phone: false,
      },
    }
  }
}