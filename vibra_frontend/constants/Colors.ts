const tintColorLight = '#4C3BCF';
const tintColorDark = '#C8ACD6';
const darkBackground = '#191825' // dark shade
const lightPurple = '#191825'; // light red shade 
const textColorLight = '#EEEEEE' // white shade
const darkPink = '#E384FF'
const lightPink = "#FFA3FD";

export default {
  light: {
    text: textColorLight,
    background: darkBackground,
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: darkPink,
    primary: tintColorLight, 
    gradientStart: '#4c669f',
    gradientEnd: '#192f6a',
    card: '#fff',              
    border: '#ccc',            
    notification: darkPink, 
  },
  dark: {
    text: textColorLight,
    background: darkBackground,
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: darkPink,
    primary: tintColorDark, 
    gradientStart: '#3b5998',
    gradientEnd: '#192f6a', 
    card: '#1e1e1e',           
    border: '#333',           
    notification: darkPink, 
  },
  darkBackground,
  textColorLight,
  lightPurple,
  darkPink,
  lightPink
};
