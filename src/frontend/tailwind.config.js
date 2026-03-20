/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        gold: 'oklch(var(--gold))',
        'gold-dim': 'oklch(var(--gold-dim))',
        'live-green': 'oklch(var(--live-green))',
        'header-bg': 'oklch(var(--header-bg))',
        'status-bar': 'oklch(var(--status-bar-bg))',
        'dark-panel': 'oklch(var(--dark-panel))',
        'darker-panel': 'oklch(var(--darker-panel))',
        'sidebar-bg': 'oklch(var(--sidebar-bg))',
        'chess-light': 'oklch(var(--chess-light-sq))',
        'chess-dark': 'oklch(var(--chess-dark-sq))',
        'chess-frame': 'oklch(var(--chess-frame))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'board': '0 8px 40px oklch(0 0 0 / 0.6), 0 2px 8px oklch(0 0 0 / 0.4)',
        'panel': '0 4px 20px oklch(0 0 0 / 0.4)',
        'gold-glow': '0 0 12px oklch(70 0.13 75 / 0.5)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
