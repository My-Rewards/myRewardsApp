import {AppConfigDataClient, StartConfigurationSessionCommand, GetLatestConfigurationCommand} from "@aws-sdk/client-appconfigdata"
import Constants  from "expo-constants";
const { applicationId, environmentId, configProfileId } = Constants.expoConfig?.extra || {};
const client = new AppConfigDataClient({region: 'us-east-1'});

export const fetchAppConfig = async() => {
    try {
        const createSession = await client.send(
            new StartConfigurationSessionCommand({
                ApplicationIdentifier: applicationId,
                EnvironmentIdentifier: environmentId,
                ConfigurationProfileIdentifier: configProfileId
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