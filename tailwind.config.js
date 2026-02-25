/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./data/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
        "./index.tsx"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            screens: { 'xs': '375px' },
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            animation: {
                'fade-in': 'fadeIn 0.25s ease-out',
                'fade-in-up': 'fadeInUp 0.4s ease-out',
                'scan': 'scanLine 3s linear infinite',
                'pulse-amber': 'pulseAmber 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s infinite linear',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                fadeInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                scanLine: { '0%': { transform: 'translateY(-20px)', opacity: '0' }, '10%': { opacity: '1' }, '90%': { opacity: '1' }, '100%': { transform: 'translateY(100%)', opacity: '0' } },
                pulseAmber: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
                shimmer: { 'from': { transform: 'translateX(-100%)' }, 'to': { transform: 'translateX(100%)' } }
            },
        },
    },
    plugins: [],
}
