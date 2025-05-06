import { Stack } from "expo-router";
import { Provider } from "react-native-paper/lib/typescript/core/settings";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="auth" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#393790' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#000000' }} />
      <Stack.Screen name="weather" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#000000' }} />
    </Stack>
  );
}
