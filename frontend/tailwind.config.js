/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3b82f6', // blue-500
                    dark: '#2563eb',    // blue-600
                    light: '#60a5fa',   // blue-400
                },
                accent: '#06b6d4', // cyan-500
            },
            animation: {
                'float': 'float 8s ease-in-out infinite',
                'float-orb': 'float-orb 8s ease-in-out infinite',
                'pulse-slow': 'pulse 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'float-orb': {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                },
            },
        },
    },
    plugins: [],
}
