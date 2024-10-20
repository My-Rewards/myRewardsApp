import { ResourcesConfig } from "aws-amplify"

export const amplifyConfiguration = ():ResourcesConfig => {
    if(process.env.NODE_ENV === 'production'){
        return{
          Auth: {
            Cognito: {
              userPoolClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID_PROD||'',
              userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID_PROD||'',
              identityPoolId:process.env.EXPO_PUBLIC_IDENTITY_POOL_ID_PROD||'',
              loginWith: { 
                oauth: {
                  domain: process.env.EXPO_PUBLIC_COGNITO_DOMAIN_PROD||'',
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
    }else{
      return{
        Auth: {
          Cognito: {
            userPoolClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID_BETA||'',
            userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID_BETA||'',
            identityPoolId:process.env.EXPO_PUBLIC_IDENTITY_POOL_ID_BETA||'',
            loginWith: { 
              oauth: {
                domain: process.env.EXPO_PUBLIC_COGNITO_DOMAIN_BETA||'',
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
    }
}