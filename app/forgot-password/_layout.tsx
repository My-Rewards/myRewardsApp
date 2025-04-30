import { Stack } from "expo-router";
import React from "react";

export default function Root() {
  return (
          <Stack>
            <Stack.Screen
              name={"index"}
              options={{
                headerShown: false,
                animation: "none",
              }}
            />
            <Stack.Screen
              name={"password-reset-success"}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={"verify-email"}
              options={{
                headerShown: false,
                animation: "fade",
              }}
            />
          </Stack>
  );
}
