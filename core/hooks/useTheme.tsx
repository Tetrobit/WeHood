import { useQuery, useRealm } from "@realm/react";
import { useColorScheme } from "react-native";
import * as SecureStorage from 'expo-secure-store';

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
  const systemTheme = useColorScheme();
  const theme = SecureStorage.getItem('theme');

  if (theme === SYSTEM_THEME || !theme) {
    return themes[systemTheme as keyof typeof themes];
  }

  return themes[theme as keyof typeof themes];
}

export function useSetTheme(): (theme: typeof THEMES[number]) => void {
  return (newThemeName: typeof THEMES[number]) => {
    SecureStorage.setItem('theme', newThemeName);
  }
}

export function useThemeName(): typeof THEMES[number] | null {
  const theme = SecureStorage.getItem('theme');
  return theme as typeof THEMES[number] | null;
}

export default useTheme;