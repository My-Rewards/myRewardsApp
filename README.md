![Update Expo Workflow Status](https://github.com/My-Rewards/myRewardsApp/actions/workflows/Update_Expo.yml/badge.svg)

![Update Expo Workflow Status](https://github.com/My-Rewards/myRewardsApp/actions/workflows/Update_Expo_Prod.yml/badge.svg)

# myRewards app

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

##### 1. Install dependencies

   ```
   npm install
   ```

## Setting up Amplify 🚧

#### 1. [Install/Setup AWS CLI](https://docs.aws.amazon.com/cli/v1/userguide/cli-chap-install.html)

```
npm i @aws-amplify/cli@v2
```

#### 2. Install Amplify CLI
```
npm install -g @aws-amplify/cli
```

## Setting up Xcode 🚧

Downloading the newest iOS for mobile development
```
xcodebuild -downloadPlatform iOS
```

Check Xcode is installed properly
```
xcode-select --install
```

## Running Code

### AWS Credentials

In order to use cdk you need to have an AWS credential, many ways to do this...

**Through AWS Portal (Reccomended)**

go to your AWS Portal and select **Access Keys** for pipeline account

Copy option 1 into terminal

ex:
```
export AWS_ACCESS_KEY_ID= xxxxx
export AWS_SECRET_ACCESS_KEY= xxxxx
export AWS_SESSION_TOKEN= xxxxx
```

##### 1. Start the app

   ```
    ./run.sh
   ```

##### 1.1 Manually running simulator (in case run.sh doesn't work)

   ```bash
    npx expo run:ios or npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.


## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
