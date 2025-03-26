import { Stack } from "expo-router";
import React from "react";

export default function Root() {
  return (
          <Stack>
            <Stack.Screen
              name={"sign-in"}
              options={{
                headerShown: false,
                animation: "none",
              }}
            />
            <Stack.Screen
              name={"sign-up"}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={"verificationScreen"}
              options={{
                headerShown: false,
                animation: "fade",
              }}
            />
          </Stack>
  );
}
