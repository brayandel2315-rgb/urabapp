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
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
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
          bright: '#3CCB6E',
          dark: '#1E9A52',
          deep: '#0D2B45',
          light: '#E6F9EE',
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
        },
        sky: {
          DEFAULT: '#0E6BA8',
          light: '#E6F4FF',
        },
        promo: {
          DEFAULT: '#F7C100',
          light: '#FFF6D6',
          dark: '#C99700',
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
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
        float: 'var(--shadow-float)',
        glow: '0 8px 28px rgba(46, 125, 50, 0.28)',
        'glow-promo': '0 8px 24px rgba(247, 193, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(155deg, #28B463 0%, #0E6BA8 55%, #0D2B45 100%)',
        'gradient-hero-mobile': 'linear-gradient(135deg, #F7FAFC 0%, #E6F4FF 55%, #FFFFFF 100%)',
        'gradient-promo': 'linear-gradient(135deg, #A8D60E 0%, #28B463 100%)',
        'gradient-primary': 'linear-gradient(135deg, #28B463 0%, #1E9A52 55%, #0D2B45 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0D2B45 0%, #061525 100%)',
        'gradient-warm': 'linear-gradient(180deg, #F7FAFC 0%, #E6F4FF 40%, #FFFFFF 100%)',
        'gradient-brand': 'linear-gradient(135deg, #28B463 0%, #0E6BA8 100%)',
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
