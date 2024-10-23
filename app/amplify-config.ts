import { ResourcesConfig } from "aws-amplify"

export const amplifyConfiguration:ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID||'',
      userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID||'',
      identityPoolId:process.env.EXPO_PUBLIC_IDENTITY_POOL_ID||'',
      loginWith: { 
        oauth: {
          domain: process.env.EXPO_PUBLIC_COGNITO_DOMAIN||'',
          scopes: ['openid','email','profile','aws.cognito.signin.user.admin'],
          redirectSignIn: ['exp://127.0.0.1:19000/--/'],
          redirectSignOut: ['exp://127.0.0.1:19000/--/'],
          responseType: 'code',
        },
        email: true,
        phone: false,
      }
    }
  }
}