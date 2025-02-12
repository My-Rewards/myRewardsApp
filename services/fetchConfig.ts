import {AppConfigDataClient, StartConfigurationSessionCommand, GetLatestConfigurationCommand} from "@aws-sdk/client-appconfigdata"
import Constants  from "expo-constants";
const { appConfig, identityPoolId, userPoolId, webClientId } = Constants.expoConfig?.extra || {};
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from "aws-amplify/auth";

export const fetchAppConfig = async() => {

    const session = await fetchAuthSession();
    console.log(session)
    const credentials = session.credentials   
    const client = new AppConfigDataClient({
        region: 'us-east-1',
        credentials: credentials
    })
    // const client = new AppConfigDataClient({region: 'us-east-1', 
    //     credentials: fromCognitoIdentityPool({
    //     client: new CognitoIdentityClient({ region: 'us-east-1' }),
    //     identityPoolId: identityPoolId
    // })});    
    
    try {
        const createSession = await client.send(
            new StartConfigurationSessionCommand({
                ApplicationIdentifier: appConfig.applicationId,
                EnvironmentIdentifier: appConfig.environmentId,
                ConfigurationProfileIdentifier: appConfig.configProfileId
            })
        );

        const sessionToken = createSession.InitialConfigurationToken;

        if(!sessionToken) {
            throw new Error("Failed to get a session token");
        }

        const config = await client.send(
            new GetLatestConfigurationCommand({
                ConfigurationToken: sessionToken,
            })
        );

        return JSON.parse(new TextDecoder().decode(config.Configuration));
    } catch (e) {
        console.log(`Error fetching AppConfig: ${e}`)
        return null;
    }
}