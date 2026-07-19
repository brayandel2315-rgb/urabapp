/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        body: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          bright: '#7AC943',
          dark: '#165735',
          deep: '#165735',
          light: '#E8F5E9',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        urgency: {
          DEFAULT: 'hsl(var(--urgency))',
          foreground: 'hsl(var(--urgency-foreground))',
        },
        banana: {
          DEFAULT: 'hsl(var(--brand-banana))',
          foreground: 'hsl(var(--brand-charcoal))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        brand: {
          navy: 'hsl(var(--brand-navy))',
          blue: 'hsl(var(--brand-blue))',
          green: 'hsl(var(--brand-green))',
          lime: 'hsl(var(--brand-lime))',
          sky: 'hsl(var(--brand-sky))',
          banana: 'hsl(var(--brand-banana))',
          charcoal: 'hsl(var(--brand-charcoal))',
          orange: 'hsl(var(--brand-orange))',
          primary: '#1E6F43',
          secondary: '#7AC943',
        },
        sky: {
          DEFAULT: '#2196F3',
          light: '#F7F8FA',
        },
        promo: {
          DEFAULT: '#FF7043',
          light: '#FFF3EE',
          dark: '#E64A19',
        },
        surface: 'hsl(var(--surface))',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-xl)',
        '3xl': 'var(--radius-component)',
        '4xl': '2rem',
        component: 'var(--radius-component)',
        btn: 'var(--radius-btn)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
        float: 'var(--shadow-float)',
        glow: '0 4px 16px rgba(17, 24, 39, 0.06)',
        'glow-promo': '0 4px 14px rgba(30, 111, 67, 0.1)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 100%)',
        'gradient-hero-mobile': 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
        'gradient-promo': 'linear-gradient(135deg, #1E6F43 0%, #165735 100%)',
        'gradient-primary': 'linear-gradient(135deg, #1E6F43 0%, #165735 100%)',
        'gradient-dark': 'linear-gradient(135deg, #111827 0%, #1B1B1B 100%)',
        'gradient-warm': 'linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 100%)',
        'gradient-brand': 'linear-gradient(135deg, #1E6F43 0%, #165735 100%)',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(40, 180, 99, 0.35)' },
          '50%': { boxShadow: '0 0 0 8px rgba(40, 180, 99, 0)' },
        },
        'sticker-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'sticker-float': 'sticker-float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
