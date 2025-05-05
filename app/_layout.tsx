import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#393790' }} />
      <Stack.Screen name="auth" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#393790' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#F8B55F' }} />
    </Stack>
  );
}
