import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="fitness-goal" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="goal-review" />
      <Stack.Screen name="exercise-setup" />
      <Stack.Screen name="recommended-plan" />
      <Stack.Screen name="(home_tabs)" />
    </Stack>
  );
}