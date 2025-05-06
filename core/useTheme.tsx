import { useMMKVString } from "react-native-mmkv";
import { themes } from "./theme";

export default function useTheme(): typeof themes[keyof typeof themes] {
  const [theme, _setTheme] = useMMKVString('theme');
  return themes[theme as keyof typeof themes];
}

export function useSetTheme(): (theme: keyof typeof themes) => void {
  const [_, setTheme] = useMMKVString('theme');
  return (theme: keyof typeof themes) => {
    setTheme(theme);
  }
}

export function useThemeName(): keyof typeof themes {
  const [theme, _setTheme] = useMMKVString('theme');
  return theme as keyof typeof themes;
}
