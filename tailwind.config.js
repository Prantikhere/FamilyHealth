/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F4F7F6',
        emerald: {
          primary: '#047857',
          light: '#ECFDF5',
          dark: '#065F46',
        },
        amber: {
          alert: '#B45309',
          light: '#FFFBEB',
        },
        rose: {
          emergency: '#BE123C',
          light: '#FFF1F2',
        },
        indigo: {
          accent: '#4338CA',
          light: '#EEF2FF',
        },
        glass: {
          surface: 'rgba(255, 255, 255, 0.78)',
          modal: 'rgba(255, 255, 255, 0.92)',
          border: 'rgba(255, 255, 255, 0.65)',
          cardBorder: 'rgba(226, 232, 240, 0.8)',
        }
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
      },
      boxShadow: {
        glass: '0 4px 16px 0 rgba(31, 38, 135, 0.07)',
        glassHover: '0 8px 24px 0 rgba(31, 38, 135, 0.12)',
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
