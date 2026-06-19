/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1c1a17',
        paper: '#f7f3ea',
        cream: '#fbf8f0',
        amber: {
          glow: '#f5a623',
          deep: '#e07b00',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'cat-pop': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
        'ripple-out': {
          '0%': { transform: 'scale(0.2)', opacity: '0.7' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'check-pop': {
          '0%': { transform: 'scale(0) rotate(-20deg)', opacity: '0' },
          '50%': { transform: 'scale(1.3) rotate(8deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
        'shake': {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-40px)', opacity: '0' },
        },
        'hint-pulse': {
          '0%,100%': { opacity: '0' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'cat-pop': 'cat-pop 0.5s ease-out',
        'ripple-out': 'ripple-out 0.6s ease-out forwards',
        'check-pop': 'check-pop 0.45s ease-out',
        'shake': 'shake 0.3s ease-in-out',
        'float-up': 'float-up 0.9s ease-out forwards',
        'hint-pulse': 'hint-pulse 1.6s ease-in-out 2',
      },
    },
  },
  plugins: [],
}
