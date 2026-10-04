/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neumorphic Light Healthcare Tokens (Luminous Light Canvas, Soft Specular & Ambient Shadows)
        canvas: '#F8FAFD',          // Luminous Clean Light Base Canvas
        neu: {
          base: '#F8FAFD',          // Extruded Base Surface
          light: '#FFFFFF',         // Specular Light Source (Top-Left)
          dark: '#DCE4EC',          // Soft Ambient Shadow (Bottom-Right)
          deep: '#D0DAE4',          // Gentle Ambient Occlusion
        },
        terracotta: {
          DEFAULT: '#2563EB',       // Luminous Medical Azure for Primary Action
          primary: '#2563EB',
          container: '#EFF6FF',     // Soft Light Azure Container
          dark: '#1D4ED8',          // Deep Azure Accent
          light: '#F8FAFD',
        },
        forest: {
          DEFAULT: '#0D9488',       // Fresh Medical Teal Accent
          palm: '#0D9488',
          container: '#F0FDFA',
          dark: '#0F766E',
          light: '#F8FAFD',
        },
        chalk: {
          DEFAULT: '#F8FAFD',       // Soft Light Neumorphic Canvas
          base: '#F8FAFD',
        },
        charcoal: {
          DEFAULT: '#1E293B',       // Slate-800 Readable Ink (Softened from Pitch Black)
          ink: '#1E293B',
          muted: '#64748B',         // Elegant Slate Secondary
        },
        ochre: {
          DEFAULT: '#D97706',
          alert: '#D97706',
          container: '#FEF3C7',
        },
        indigoVerified: {
          DEFAULT: '#2563EB',
          seal: '#2563EB',
          container: '#EFF6FF',
        },
        sand: {
          DEFAULT: '#F8FAFD',
          surface: '#F8FAFD',
          variant: '#E2E8F0',
        },
        borderRule: {
          DEFAULT: 'rgba(255, 255, 255, 0.9)',
        },
        emergency: {
          DEFAULT: '#E11D48',       // High-Contrast Neumorphic Crimson
          accent: '#E11D48',
          container: '#FFE4E6',
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
        xs: '2px 2px 5px #dce4ec, -2px -2px 5px #ffffff',
        subtle: '3px 3px 7px #dce4ec, -3px -3px 7px #ffffff',
        card: '6px 6px 14px #dce4ec, -6px -6px 14px #ffffff',
        lifted: '8px 8px 20px #d0dae4, -8px -8px 20px #ffffff',
        'neu-flat': '5px 5px 12px #dce4ec, -5px -5px 12px #ffffff',
        'neu-raised': '4px 4px 9px #dce4ec, -4px -4px 9px #ffffff',
        'neu-pressed': 'inset 3px 3px 6px #dce4ec, inset -3px -3px 6px #ffffff',
        'neu-deep': '7px 7px 16px #d0dae4, -7px -7px 16px #ffffff',
        'neu-sm': '2px 2px 5px #dce4ec, -2px -2px 5px #ffffff',
        'neu-inset-sm': 'inset 2px 2px 4px #dce4ec, inset -2px -2px 4px #ffffff',
        'neu-primary': '4px 4px 10px #bfdbfe, -3px -3px 8px #ffffff',
        'neu-primary-pressed': 'inset 3px 3px 6px #1d4ed8, inset -2px -2px 4px #60a5fa',
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
