/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
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
          50: 'rgb(var(--sand-50) / <alpha-value>)',
          100: 'rgb(var(--sand-100) / <alpha-value>)',
          200: 'rgb(var(--sand-200) / <alpha-value>)',
          300: 'rgb(var(--sand-300) / <alpha-value>)',
          400: 'rgb(var(--sand-400) / <alpha-value>)',
          500: 'rgb(var(--sand-500) / <alpha-value>)',
          600: 'rgb(var(--sand-600) / <alpha-value>)',
          700: 'rgb(var(--sand-700) / <alpha-value>)',
          800: 'rgb(var(--sand-800) / <alpha-value>)',
          900: 'rgb(var(--sand-900) / <alpha-value>)',
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
        },
        // Fonte grise chaude — utilisée pour les sections "salle de sport" (hero, CTA)
        iron: {
          950: '#15110d',
          900: '#1e1712',
          800: '#2b221a',
          700: '#3d2f23',
          600: '#5a4735',
        },
        // Accent rare — braise/fer oxydé, réservé aux moments "record"
        ember: {
          500: '#c1512f',
          600: '#a83f22',
        },
        // Blanc craie — texte sur fond iron
        chalk: {
          100: '#f3efe6',
        },
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        plate: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary':
          'linear-gradient(135deg, rgb(var(--sand-500)) 0%, rgb(var(--sand-600)) 100%)',
        'gradient-subtle':
          'linear-gradient(180deg, rgba(250, 248, 246, 1) 0%, rgba(255, 255, 255, 1) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        soft: '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 40px 0 rgba(0, 0, 0, 0.08)',
        glow: '0 0 20px rgba(var(--sand-500), 0.3)',
      },
    },
  },
  plugins: [],
};
