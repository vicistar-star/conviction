/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        conviction: {
          purple: '#7C3AED',
          blue: '#0052FF',
        },
      },
    },
  },
  plugins: [],
};
