/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blueprint LLD African Earth Tone Palette
        terracotta: {
          DEFAULT: '#C85A32',
          primary: '#C85A32',
          container: '#F4DDD4',
          dark: '#A64522',
          light: '#F8ECE7',
        },
        forest: {
          DEFAULT: '#1E4D38',
          palm: '#1E4D38',
          container: '#D3E4DB',
          dark: '#143727',
          light: '#EAF2ED',
        },
        chalk: {
          DEFAULT: '#F9F6F0',
          base: '#F9F6F0',
        },
        charcoal: {
          DEFAULT: '#141210',
          ink: '#141210',
          muted: '#5C564E',
        },
        ochre: {
          DEFAULT: '#D9822B',
          alert: '#D9822B',
          container: '#FDF1E2',
        },
        indigoVerified: {
          DEFAULT: '#1B2A4A',
          seal: '#1B2A4A',
          container: '#E8ECF5',
        },
        sand: {
          DEFAULT: '#EFE9DF',
          surface: '#EFE9DF',
          variant: '#E4DDD1',
        },
        borderRule: {
          DEFAULT: '#E2DCD2',
        },
        emergency: {
          DEFAULT: '#BA1A1A',
          accent: '#BA1A1A',
          container: '#FFEDEA',
        },
        canvas: '#F9F6F0',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        subtle: '0 2px 8px 0 rgba(20, 18, 16, 0.04)',
        card: '0 4px 16px 0 rgba(20, 18, 16, 0.06)',
        lifted: '0 10px 25px -3px rgba(20, 18, 16, 0.1)',
      },
      minHeight: {
        tap: '48px',
      },
      minWidth: {
        tap: '48px',
      }
    },
  },
  plugins: [],
}
