/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['montserrat', 'sans-serif'],
        SixtyfourConvergence: ['Sixtyfour Convergence'],
        Updock: ['Updock'],
        Pacifico:['Pacifico'],
        roboto:['Roboto']
      },
      colors:{
        darkgreen: "#186E64",
        linkblue: "#4337D4",
        gray: "#D9D9D9",
        darkgray:"#847F7F",
        offwhite: "#FAFAFA",
        darkergray:"#E9E8E8",
        blue: "#1B62CD",
        green: "#48742C",
        mediumgray: "#B7B7B7",
        orange: "#F88D13",
        yellow: "#F8DD13",
        red: "#F81313"
      }
    },
  },
  plugins: [],
}