/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}', './index.ts'],
  theme: {
    extend: {
      colors: {
        brand: '#2E7D32',
        danger: { DEFAULT: '#B00020', light: '#D32F2F' },
      },
      borderRadius: { xl: '0.75rem', '2xl': '1rem' }
    },
  },
  plugins: [],
  darkMode: 'class',
};
