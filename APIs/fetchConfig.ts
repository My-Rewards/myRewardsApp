import {AppConfigDataClient, StartConfigurationSessionCommand, GetLatestConfigurationCommand} from "@aws-sdk/client-appconfigdata"
import Constants  from "expo-constants";
const { appConfig } = Constants.expoConfig?.extra || {};
import { fetchAuthSession } from "aws-amplify/auth";

export const fetchAppConfig = async() => {

    const session = await fetchAuthSession();
    const credentials = session.credentials   
    const client = new AppConfigDataClient({
        region: 'us-east-1',
        credentials: credentials
    })
    
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
        return null;
    }
}