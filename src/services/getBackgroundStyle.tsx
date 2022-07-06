import {StatusBarStyle, StyleSheet, useColorScheme} from 'react-native';

const getBackgroundStyle = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#222' : '#F3F3F3',
      bar: (isDarkMode ? 'light-content' : 'dark-content') as StatusBarStyle,
    },
  });
};
export default getBackgroundStyle;
