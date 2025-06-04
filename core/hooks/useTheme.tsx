import { useQuery, useRealm } from "@realm/react";
import { useColorScheme } from "react-native";
import * as SecureStorage from 'expo-secure-store';
import React, { createContext } from "react";

export type Theme = 'light' | 'dark';

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: (theme: Theme) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = React.useState<Theme>(SecureStorage.getItem('theme') as Theme);

  React.useEffect(() => {
    SecureStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: (theme: Theme) => setTheme(theme as Theme) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): [Theme, (theme: Theme) => void] => {
  const { theme, setTheme } = React.useContext(ThemeContext);
  return [theme, setTheme];
}

export default ThemeProvider;
