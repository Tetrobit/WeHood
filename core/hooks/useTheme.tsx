import { useQuery, useRealm } from "@realm/react";
import Theme from "../models/theme";

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';
export const THEMES = [LIGHT_THEME, DARK_THEME];

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

export default function useTheme(): typeof themes[keyof typeof themes] {
  const [theme] = useQuery(Theme);
  return themes[theme?.name as keyof typeof themes];
}

export function useSetTheme(): (theme: keyof typeof themes) => void {
  const [theme] = useQuery(Theme);
  const realm = useRealm();
  return (newThemeName: keyof typeof themes) => {
    realm.write(() => {
      theme.name = newThemeName;
    });
  }
}

export function useThemeName(): keyof typeof themes {
  const [theme] = useQuery(Theme);
  return theme?.name as keyof typeof themes;
}
