import { Redirect } from "expo-router";
import { useMMKVString } from "react-native-mmkv";
import { LIGHT_THEME, THEMES } from "@/core/theme";

export default function App() {
  const [theme, setTheme] = useMMKVString('theme');

  if (!THEMES.includes(theme!)) {
    setTheme(LIGHT_THEME);
    return null;
  }

  return <Redirect href={'/auth'} />
}
