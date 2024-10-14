#!/bin/bash

# Detect the operating system
os="$(uname)"
default_platform=""

# Determine the default platform based on OS
if [[ "$os" == "Darwin" ]]; then
    default_platform="ios"
elif [[ "$os" == "Linux" || "$os" == "MINGW"* || "$os" == "CYGWIN"* ]]; then
    default_platform="android"
else
    echo "Unsupported operating system."
    exit 1
fi

# Display the options
echo "Select the platform you want to run:"
echo "1) iOS"
echo "2) Android"
echo "Press enter to use the default option [$default_platform]"

# Read user input with a default option
read -r choice

# Determine which option the user selected or use the default
if [ -z "$choice" ]; then
    platform=$default_platform
elif [ "$choice" == "1" ]; then
    platform="ios"
elif [ "$choice" == "2" ]; then
    platform="android"
else
    echo "Invalid option. Please choose 1 (iOS) or 2 (Android)."
    exit 1
fi

# Run the appropriate platform build
if [ "$platform" == "ios" ]; then
    echo "Running iOS build..."
    npx expo run:ios
elif [ "$platform" == "android" ]; then
    echo "Running Android build..."
    npx expo run:android
fi