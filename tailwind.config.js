/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        agri: {
          olive: '#71873f',     // Primary Olive Green
          sage: '#abbe99',      // Light Sage Green
          forest: '#688557',    // Deep Forest Olive
          earth: '#a36627',     // Warm Ochre Earth Brown
          wheat: '#e0b87e',     // Soft Wheat Gold
          cream: '#fcfaf7',     // Organic Light Background
          sand: '#f4efe6',      // Warm Section Sand
          surface: '#ffffff',   // Surface Card White
          text: '#243118',      // High-contrast Deep Olive Text
          muted: '#637554',     // Muted Subtext
        },
        goi: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          navy: '#0A2540',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'ticker': 'ticker 35s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
