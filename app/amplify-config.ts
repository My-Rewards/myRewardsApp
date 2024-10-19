export const amplifyConfiguration = () => {
    if(process.env.REACT_APP_ENV === 'prod'){
        return{
            "aws_project_region": process.env.AWS_REGION,
            "aws_cognito_identity_pool_id": process.env.IDENTITY_POOL_ID_PROD,
            "aws_cognito_region": process.env.AWS_REGION,
            "aws_user_pools_id": process.env.USER_POOL_ID_PROD,
            "aws_user_pools_web_client_id": process.env.WEB_CLIENT_ID_,
            "oauth": {
              "domain": process.env.COGNITO_DOMAIN_PROD,
              "scope": [
                "phone",
                "email",
                "openid",
                "profile",
                "aws.cognito.signin.user.admin"
              ],
              "redirectSignIn": "exp://127.0.0.1:19000/--/",
              "redirectSignOut": "exp://127.0.0.1:19000/--/",
              "responseType": "code"
            },
            "federationTarget": "COGNITO_USER_POOLS",
            "aws_cognito_username_attributes": [
              "EMAIL"
            ],
            "aws_cognito_social_providers": [],
            "aws_cognito_signup_attributes": [
              "EMAIL"
            ],
            "aws_cognito_mfa_configuration": "OFF",
            "aws_cognito_mfa_types": [
              "SMS"
            ],
            "aws_cognito_password_protection_settings": {
              "passwordPolicyMinLength": 8,
              "passwordPolicyCharacters": []
            },
            "aws_cognito_verification_mechanisms": [
              "EMAIL"
            ]
          }
    }else{
        return{
            "aws_project_region": process.env.AWS_REGION,
            "aws_cognito_identity_pool_id": process.env.IDENTITY_POOL_ID_BETA,
            "aws_cognito_region": process.env.AWS_REGION,
            "aws_user_pools_id": process.env.USER_POOL_ID_BETA,
            "aws_user_pools_web_client_id": process.env.WEB_CLIENT_ID_BETA,
            "oauth": {
              "domain": process.env.COGNITO_DOMAIN_BETA,
              "scope": [
                "phone",
                "email",
                "openid",
                "profile",
                "aws.cognito.signin.user.admin"
              ],
              "redirectSignIn": "exp://127.0.0.1:19000/--/",
              "redirectSignOut": "exp://127.0.0.1:19000/--/",
              "responseType": "code"
            },
            "federationTarget": "COGNITO_USER_POOLS",
            "aws_cognito_username_attributes": [
              "EMAIL"
            ],
            "aws_cognito_social_providers": [],
            "aws_cognito_signup_attributes": [
              "EMAIL"
            ],
            "aws_cognito_mfa_configuration": "OFF",
            "aws_cognito_mfa_types": [
              "SMS"
            ],
            "aws_cognito_password_protection_settings": {
              "passwordPolicyMinLength": 8,
              "passwordPolicyCharacters": []
            },
            "aws_cognito_verification_mechanisms": [
              "EMAIL"
            ]
          }
    }
}