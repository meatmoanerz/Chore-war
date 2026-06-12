/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        krita: '#FBF8F3',
        blck: '#232041',
        hallon: '#FF4D6D',
        hallondark: '#E63E5C',
        mynta: '#2DD4BF',
        sol: '#FFB938',
        himmel: '#5B7CFF',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '1.25rem' },
      boxShadow: { card: '0 2px 12px rgba(35,32,65,0.08)' },
    },
  },
  plugins: [],
}
