import dotenv from 'dotenv'
import {AppConfigDataClient, StartConfigurationSessionCommand, GetLatestConfigurationCommand} from "@aws-sdk/client-appconfigdata"
dotenv.config();

const REGION = process.env.AWS_REGION;
const APPLICATION_ID = process.env.APPLICATION_ID;
const ENVIRONMENT_ID = process.env.ENVIRONMENT_ID;
const CONFIG_PROFILE_ID = process.env.CONFIG_PROFILE_ID;
const client = new AppConfigDataClient({region: REGION});

export const fetchAppConfig = async() => {
    try {
        const createSession = await client.send(
            new StartConfigurationSessionCommand({
                ApplicationIdentifier: APPLICATION_ID,
                EnvironmentIdentifier: ENVIRONMENT_ID,
                ConfigurationProfileIdentifier: CONFIG_PROFILE_ID
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