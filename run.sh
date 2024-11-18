#!/bin/bash

# Fetch available SSO profiles from the AWS config file
echo "Fetching available SSO profiles..."

if [[ ! -f ~/.aws/config ]]; then
    echo "AWS config file not found. Please configure AWS CLI with 'aws configure sso'."
    exit 1
fi

# Extract profiles without using grep -P
first_sso_profile=$(awk '/^\[profile / {print $2; exit}' ~/.aws/config | sed 's/]//')

if [[ -z "$first_sso_profile" ]]; then
    echo "No SSO profiles found in ~/.aws/config. Please configure one with 'aws configure sso'."
    exit 1
fi

# Automatically select the first profile
selected_profile="$first_sso_profile"
echo "Using the first SSO profile: $selected_profile"

# Fetch parameters from SSM using the selected SSO profile
echo "Fetching AWS Parameters using profile: $selected_profile"
PARAMS=$(aws ssm get-parameters --names "/myRewardsApp/beta/userPoolId" "/myRewardsApp/beta/webClientId" "/myRewardsApp/beta/cognitoDomain" "/myRewardsApp/beta/identityPoolId" --with-decryption --region us-east-1 --profile "$selected_profile")

# Check if the command ran successfully
if [[ $? -ne 0 ]]; then
    echo "Error: Failed to fetch AWS parameters. Please check your profile, permissions, or network connectivity. Ensure your logged in via sso 'aws sso login --profile <PROFILE>'"
    exit 1
fi
# Extract the values using jq
USER_POOL_ID=$(echo "$PARAMS" | jq -r '.Parameters[] | select(.Name=="/myRewardsApp/beta/userPoolId").Value')
WEB_CLIENT_ID=$(echo "$PARAMS" | jq -r '.Parameters[] | select(.Name=="/myRewardsApp/beta/webClientId").Value')
COGNITO_DOMAIN=$(echo "$PARAMS" | jq -r '.Parameters[] | select(.Name=="/myRewardsApp/beta/cognitoDomain").Value')
IDENTITY_POOL_ID=$(echo "$PARAMS" | jq -r '.Parameters[] | select(.Name=="/myRewardsApp/beta/identityPoolId").Value')


# Write to .env file
echo "EXPO_PUBLIC_USER_POOL_ID=$USER_POOL_ID" > .env
echo "EXPO_PUBLIC_WEB_CLIENT_ID=$WEB_CLIENT_ID" >> .env
echo "EXPO_PUBLIC_COGNITO_DOMAIN=$COGNITO_DOMAIN" >> .env
echo "EXPO_PUBLIC_IDENTITY_POOL_ID=$IDENTITY_POOL_ID" >> .env
echo "EXPO_PUBLIC_AWS_REGION=us-east-1" >> .env

echo ".env file updated successfully!"

# Detect the operating system and determine the platform
os="$(uname)"
if [[ "$os" == "Darwin" ]]; then
    platform="ios"
elif [[ "$os" == "Linux" || "$os" == "MINGW"* || "$os" == "CYGWIN"* ]]; then
    platform="android"
else
    echo "Unsupported operating system."
    exit 1
fi

# Run the appropriate platform build
if [[ "$platform" == "ios" ]]; then
    echo "Running iOS build..."
    npx expo run:ios
elif [[ "$platform" == "android" ]]; then
    echo "Running Android build..."
    npx expo run:android
fi
