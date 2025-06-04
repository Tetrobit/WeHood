import * as SecureStorage from 'expo-secure-store';
import React, { createContext } from "react";
import { useColorScheme } from 'react-native';

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
  const systemTheme = useColorScheme();
  const [theme, setTheme] = React.useState<Theme>((SecureStorage.getItem('theme') as (Theme | null)) || systemTheme || 'light');

  React.useEffect(() => {
    if (!SecureStorage.getItem('theme')) {
      SecureStorage.setItemAsync('theme', theme as Theme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: (theme: Theme) => {
      console.log('getTheme', SecureStorage.getItem('theme'));
      console.log('setTheme', theme);
      setTheme(theme as Theme);
      SecureStorage.setItem('theme', theme as Theme);
    } }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): [Theme, (theme: Theme) => void] => {
  const { theme, setTheme } = React.useContext(ThemeContext);
  return [theme, setTheme];
}

export default ThemeProvider;
