/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Palette beige épurée et minimaliste
        primary: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c', // Beige principal
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        sand: {
          50: '#fdfcfb',
          100: '#faf8f6',
          200: '#f5f1ed',
          300: '#ede7df',
          400: '#e3d9cc',
          500: '#d4c4b0', // Sable
          600: '#b8a48f',
          700: '#9b8772',
          800: '#7d6d5c',
          900: '#625749',
        },
        cream: {
          50: '#fffef9',
          100: '#fffdf5',
          200: '#fffaeb',
          300: '#fef5d9',
          400: '#fdedc1',
          500: '#fbe3a1', // Crème
          600: '#e8c66d',
          700: '#d1a84b',
          800: '#b08838',
          900: '#8f6e2c',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #d4c4b0 0%, #b8a48f 100%)',
        'gradient-subtle': 'linear-gradient(180deg, rgba(250, 248, 246, 1) 0%, rgba(255, 255, 255, 1) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 40px 0 rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(212, 196, 176, 0.3)',
      }
    },
  },
  plugins: [],
}
