/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950
        surface: '#020617',
        card: '#020617',
      },
    },
  },
  plugins: [],
};

