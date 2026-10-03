/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neumorphic Design Tokens (Soft Slate-Tinted UI, Dual Specular & Ambient Shadows)
        canvas: '#E8EDF5',          // Soft Cloud Slate Neumorphic Base Canvas
        neu: {
          base: '#E8EDF5',          // Extruded Base Surface
          light: '#FFFFFF',         // Specular Light Source (Top-Left)
          dark: '#CAD3DE',          // Soft Ambient Shadow (Bottom-Right)
          deep: '#BCC8D6',          // Deeper Shadow for Elevated Elements
        },
        terracotta: {
          DEFAULT: '#0F172A',       // Deep Midnight Slate for Primary Action
          primary: '#0F172A',
          container: '#E8EDF5',     // Neumorphic Container
          dark: '#020617',          // Deepest Night
          light: '#E8EDF5',
        },
        forest: {
          DEFAULT: '#1E293B',       // Deep Slate
          palm: '#1E293B',
          container: '#E8EDF5',
          dark: '#0F172A',
          light: '#E8EDF5',
        },
        chalk: {
          DEFAULT: '#E8EDF5',       // Soft Neumorphic Canvas
          base: '#E8EDF5',
        },
        charcoal: {
          DEFAULT: '#0F172A',       // High Contrast Crisp Ink
          ink: '#0F172A',
          muted: '#64748B',         // Elegant Slate Secondary
        },
        ochre: {
          DEFAULT: '#334155',
          alert: '#334155',
          container: '#E8EDF5',
        },
        indigoVerified: {
          DEFAULT: '#0F172A',
          seal: '#0F172A',
          container: '#E8EDF5',
        },
        sand: {
          DEFAULT: '#E8EDF5',
          surface: '#E8EDF5',
          variant: '#D8E0EB',
        },
        borderRule: {
          DEFAULT: 'rgba(255, 255, 255, 0.8)',
        },
        emergency: {
          DEFAULT: '#E11D48',       // High-Contrast Neumorphic Crimson
          accent: '#E11D48',
          container: '#E8EDF5',
        },
        zinc: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'Cabinet Grotesk', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        xs: '2px 2px 5px #cad3df, -2px -2px 5px #ffffff',
        subtle: '3px 3px 7px #cad3df, -3px -3px 7px #ffffff',
        card: '7px 7px 16px #cad3df, -7px -7px 16px #ffffff',
        lifted: '10px 10px 24px #cad3df, -10px -10px 24px #ffffff',
        'neu-flat': '6px 6px 14px #cad3df, -6px -6px 14px #ffffff',
        'neu-raised': '4px 4px 9px #cad3df, -4px -4px 9px #ffffff',
        'neu-pressed': 'inset 3px 3px 6px #cad3df, inset -3px -3px 6px #ffffff',
        'neu-deep': '8px 8px 18px #cad3df, -8px -8px 18px #ffffff',
        'neu-sm': '3px 3px 6px #cad3df, -3px -3px 6px #ffffff',
        'neu-inset-sm': 'inset 2px 2px 4px #cad3df, inset -2px -2px 4px #ffffff',
        'neu-primary': '5px 5px 12px #cad3df, -3px -3px 8px #ffffff',
        'neu-primary-pressed': 'inset 3px 3px 6px #090d16, inset -2px -2px 4px #26334d',
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
