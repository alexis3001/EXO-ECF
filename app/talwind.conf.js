// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#34c759',
        textcolor: '#333',
        background: '#a3d4f7',
        headerbg: '#6bb8e6',
        footerbg: '#6bb8e6',
        cardbg: '#e2f0fb',
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
      
      extend: {
  colors: {
    primary: '#13ae1bff', // ou remplace par #34c759 pour cohérence
  },
}
    },
  },
  plugins: [],
}


