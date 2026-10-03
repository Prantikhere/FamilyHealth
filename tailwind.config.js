/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Minimalist + Monochrome Palette (Obsidian, Graphite, Slate, Zinc, Pure White)
        terracotta: {
          DEFAULT: '#09090B',       // Pure Obsidian Black for Primary Action
          primary: '#09090B',
          container: '#F4F4F5',     // Soft Zinc Container
          dark: '#000000',          // Deepest Pitch Black
          light: '#F4F4F5',         // Light Zinc Surface
        },
        forest: {
          DEFAULT: '#18181B',       // Deep Graphite
          palm: '#18181B',
          container: '#E4E4E7',     // Crisp Cool Gray
          dark: '#09090B',
          light: '#F4F4F5',
        },
        chalk: {
          DEFAULT: '#FFFFFF',       // Pure Luminous White
          base: '#FFFFFF',
        },
        charcoal: {
          DEFAULT: '#09090B',       // Primary Black Typography
          ink: '#09090B',
          muted: '#71717A',         // Refined Secondary Zinc
        },
        ochre: {
          DEFAULT: '#27272A',       // Subtle Graphite Alert
          alert: '#27272A',
          container: '#F4F4F5',
        },
        indigoVerified: {
          DEFAULT: '#09090B',       // Official Verified Monochrome Seal
          seal: '#09090B',
          container: '#F4F4F5',
        },
        sand: {
          DEFAULT: '#F4F4F5',       // Crisp Zinc Surface
          surface: '#F4F4F5',
          variant: '#E4E4E7',       // Border Variant
        },
        borderRule: {
          DEFAULT: '#E4E4E7',       // Minimalist Hairline Border
        },
        emergency: {
          DEFAULT: '#09090B',       // High-Contrast Stark Inverted SOS
          accent: '#09090B',
          container: '#F4F4F5',
        },
        canvas: '#FAFAFA',          // Ultra-Clean Minimalist Canvas
        zinc: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'Cabinet Grotesk', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '22px',
        '3xl': '28px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 6px 16px -2px rgba(0, 0, 0, 0.03)',
        lifted: '0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
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
