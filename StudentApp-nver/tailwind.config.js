/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        //primary
        bluePantone: '#2957A4',   // PANTONE 3584 C
        beigePantone: '#D2AE6D',  // PANTONE P 15-12 C
        blackPantone: '#201E1E',  // PANTONE Black

        //Extended
        lightBlue: '#5A8CC2',
        darkBlue: '#1E3A66',
        yellowGold: '#F5C85A',

        // Neutrals
        offWhite: '#F8F8F8',
        grayLight: '#E0E0E0',
        grayDark: '#4A4A4A',
      },
      fontFamily: {
        arial: ["Arial", "sans-serif"],
        arialBlackItalic: ["ArialBlackItalic", "sans-serif"],
        arialBold: ["ArialBold", "sans-serif"],
        arialItalic: ["ArialItalic", "sans-serif"],
        bookmanOldStyle: ["BookmanOldStyle", "serif"],
        bookmanOldStyleBold: ["BookmanOldStyleBold", "serif"],
        bookmanOldStyleBoldItalic: ["BookmanOldStyleBoldItalic", "serif"],
        bookmanOldStyleItalic: ["BookmanOldStyleItalic", "serif"],
        timesNewRoman: ["TimesNewRoman", "serif"],
        timesNewRomanBold: ["TimesNewRomanBold", "serif"],
        timesNewRomanBoldItalic: ["TimesNewRomanBoldItalic", "serif"],
      },      
    },
  },
  plugins: [],
}

