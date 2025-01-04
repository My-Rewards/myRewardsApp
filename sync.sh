#!/bin/bash

# Fetch available SSO profiles from the AWS config file
echo "Fetching available SSO profiles..."

if [[ ! -f ~/.aws/config ]]; then
    echo "AWS config file not found. Please configure AWS CLI with 'aws configure sso'."
    exit 1
fi

# Extract all available SSO profiles from the AWS config file
sso_profiles=($(awk '/^\[profile / {print $2}' ~/.aws/config | sed 's/]//'))

if [[ ${#sso_profiles[@]} -eq 0 ]]; then
    echo "No SSO profiles found in ~/.aws/config. Please configure one with 'aws configure sso'."
    exit 1
fi

# Display profiles and prompt user to select one
echo "Available SSO profiles:"
for i in "${!sso_profiles[@]}"; do
    echo "$((i + 1)). ${sso_profiles[$i]}"
done

read -p "Enter the number of the profile you want to use: " profile_index

if [[ ! "$profile_index" =~ ^[0-9]+$ ]] || ((profile_index < 1 || profile_index > ${#sso_profiles[@]})); then
    echo "Invalid selection. Please enter a valid number between 1 and ${#sso_profiles[@]}."
    exit 1
fi

# Get the selected profile
selected_profile="${sso_profiles[$((profile_index - 1))]}"
echo "You selected profile: $selected_profile"

# Try to fetch parameters without logging in
echo "Fetching AWS Parameters using profile: $selected_profile..."
PARAMS=$(aws ssm get-parameters --names "/myRewardsApp/beta/customerUserPoolId" "/myRewardsApp/beta/customerWebClientId" "/myRewardsApp/beta/customerCognitoDomain" "/myRewardsApp/beta/identityPoolIdCustomer" --with-decryption --region us-east-1 --profile "$selected_profile" 2>/dev/null)

if [[ $? -ne 0 ]]; then
    echo "AWS SSO session expired or invalid. Logging in with profile: $selected_profile..."
    aws sso login --profile "$selected_profile"
    if [[ $? -ne 0 ]]; then
        echo "Error: Failed to log in. Please check your AWS SSO configuration."
        exit 1
    fi

    # Retry fetching parameters after login
    echo "Retrying fetch of AWS Parameters..."
    PARAMS=$(aws ssm get-parameters --names "/myRewardsApp/beta/customerUserPoolId" "/myRewardsApp/beta/customerWebClientId" "/myRewardsApp/beta/customerCognitoDomain" "/myRewardsApp/beta/identityPoolIdCustomer" --with-decryption --region us-east-1 --profile "$selected_profile")

    if [[ $? -ne 0 ]]; then
        echo "Error: Failed to fetch AWS parameters after logging in. Please check your profile, permissions, or network connectivity."
        exit 1
    fi
fi

# Extract the values using jq
USER_POOL_ID=$(echo "$PARAMS" | jq -r '.Parameters[] | select(.Name=="/myRewardsApp/beta/customerUserPoolId").Value')
WEB_CLIENT_ID=$(echo "$PARAMS" | jq -r '.Parameters[] | select(.Name=="/myRewardsApp/beta/customerWebClientId").Value')
COGNITO_DOMAIN=$(echo "$PARAMS" | jq -r '.Parameters[] | select(.Name=="/myRewardsApp/beta/customerCognitoDomain").Value')
IDENTITY_POOL_ID=$(echo "$PARAMS" | jq -r '.Parameters[] | select(.Name=="/myRewardsApp/beta/identityPoolIdCustomer").Value')

# Write to .env file
echo "USERPOOL_ID=$USER_POOL_ID" > .env
echo "WEB_CLIENT_ID=$WEB_CLIENT_ID" >> .env
echo "COGNITO_DOMAIN=$COGNITO_DOMAIN" >> .env
echo "IDENTITY_POOL_ID=$IDENTITY_POOL_ID" >> .env
echo "AWS_REGION=us-east-1" >> .env
echo "APP_ENV=dev" >> .env

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
    npx expo run:ios --device
elif [[ "$platform" == "android" ]]; then
    echo "Running Android build..."
    npx expo run:android
fi