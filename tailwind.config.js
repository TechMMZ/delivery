/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e293b',      // Azul personalizado
        secondary: '#F59E0B',    // Amarillo personalizado
        danger: '#DC2626',       // Rojo personalizado
      }
    },
  },
  plugins: [],
}

