import { useQuery, useRealm } from "@realm/react";
import Theme from "../models/theme";
import { useColorScheme } from "react-native";

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';
export const SYSTEM_THEME = 'system';
export const THEMES = [LIGHT_THEME, DARK_THEME, SYSTEM_THEME] as const;

export type ThemeName = typeof THEMES[number];

export const themes = {
  [LIGHT_THEME]: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#000000',
    buttonColor: '#000000',
    buttonTextColor: '#ffffff',
  },
  [DARK_THEME]: {
    backgroundColor: '#000000',
    textColor: '#ffffff',
    borderColor: '#ffffff',
    buttonColor: '#ffffff',
    buttonTextColor: '#000000',
    backgroundGradient: {
      start: '#000000',
      end: '#000000',
    },
  },
}

export function useTheme(): typeof themes[keyof typeof themes] {
  const [theme] = useQuery(Theme);
  const systemTheme = useColorScheme();

  if (theme?.name === SYSTEM_THEME || !theme) {
    return themes[systemTheme as keyof typeof themes];
  }

  return themes[theme?.name as keyof typeof themes];
}

export function useSetTheme(): (theme: typeof THEMES[number]) => void {
  const [theme] = useQuery(Theme);
  const realm = useRealm();
  return (newThemeName: typeof THEMES[number]) => {
    if (theme) {
      realm.write(() => {
        theme.name = newThemeName;
      });
    }
    else {
      realm.write(() => {
        realm.create(Theme, Theme.generate(newThemeName));
      });
    }
  }
}

export function useThemeName(): typeof THEMES[number] | null {
  const [theme] = useQuery(Theme);
  return theme?.name as typeof THEMES[number] | null;
}

export default useTheme;