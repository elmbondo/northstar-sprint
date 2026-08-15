/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          espresso: '#2C1B18',   // Dark espresso
          chocolate: '#3D2B24',  // Chocolate brown
          coffee: '#4A352F',     // Intermediate brown
          taupe: '#C5B49C',      // Muted beige/taupe
          beige: '#EAE3D2',      // Warm beige
          sand: '#F0ECE3',       // Light sand
          cream: '#F9F6F0',      // Warm cream
          creamDark: '#F3EDE2',  // Slightly darker cream
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
