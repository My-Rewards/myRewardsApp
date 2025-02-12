#!/bin/bash

# Fetch available SSO profiles from the AWS config file
APP_ENV=${1:-beta}

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
PARAMS=$(aws ssm get-parameters --names "/myRewardsApp/$APP_ENV/customerUserPoolId" "/myRewardsApp/$APP_ENV/customerWebClientId" "/myRewardsApp/$APP_ENV/identityPoolIdCustomer" "/myRewardsApp/$APP_ENV/appConfig" --with-decryption --region us-east-1 --profile "$selected_profile" 2>/dev/null)

if [[ $? -ne 0 ]]; then
    echo "AWS SSO session expired or invalid. Logging in with profile: $selected_profile..."
    aws sso login --profile "$selected_profile"
    if [[ $? -ne 0 ]]; then
        echo "Error: Failed to log in. Please check your AWS SSO configuration."
        exit 1
    fi

    # Retry fetching parameters after login
    echo "Retrying fetch of AWS Parameters..."
    PARAMS=$(aws ssm get-parameters --names "/myRewardsApp/$APP_ENV/customerUserPoolId" "/myRewardsApp/$APP_ENV/customerWebClientId" "/myRewardsApp/$APP_ENV/identityPoolIdCustomer" "/myRewardsApp/$APP_ENV/appConfig" --with-decryption --region us-east-1 --profile "$selected_profile")

    if [[ $? -ne 0 ]]; then
        echo "Error: Failed to fetch AWS parameters after logging in. Please check your profile, permissions, or network connectivity."
        exit 1
    fi
fi

# Extract the values using jq
USER_POOL_ID=$(echo "$PARAMS" | jq -r ".Parameters[] | select(.Name==\"/myRewardsApp/$APP_ENV/customerUserPoolId\").Value")
WEB_CLIENT_ID=$(echo "$PARAMS" | jq -r ".Parameters[] | select(.Name==\"/myRewardsApp/$APP_ENV/customerWebClientId\").Value")
IDENTITY_POOL_ID=$(echo "$PARAMS" | jq -r ".Parameters[] | select(.Name==\"/myRewardsApp/$APP_ENV/identityPoolIdCustomer\").Value")
APP_CONFIG_VALUES=$(echo "$PARAMS" | jq -r ".Parameters[] | select(.Name==\"/myRewardsApp/$APP_ENV/appConfig\").Value")

# Write to .env file
echo "USERPOOL_ID=$USER_POOL_ID" > .env
echo "WEB_CLIENT_ID=$WEB_CLIENT_ID" >> .env
echo "IDENTITY_POOL_ID=$IDENTITY_POOL_ID" >> .env
echo "AWS_REGION=us-east-1" >> .env
echo "APP_ENV=$APP_ENV" >> .env
echo "APP_CONFIG_VALUES=$APP_CONFIG_VALUES" >> .env

echo "($APP_ENV) .env file updated successfully!"