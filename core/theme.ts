const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';
const THEMES = [LIGHT_THEME, DARK_THEME];

type ThemeName = typeof THEMES[number];

const themes = {
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

export { LIGHT_THEME, DARK_THEME, THEMES, themes, ThemeName };
