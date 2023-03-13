/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2C50EE',
        'negative': '#F4382B',
        'positive': '#1C9C54',
        'midnight': '#161618',
      },
    },
  },
  plugins: [],
};
