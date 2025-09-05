import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Arch1ve 브랜드 컬러
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff5500', // 메인 오렌지 컬러
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // HOSONO 스타일 크림 컬러
        cream: {
          50: '#fefcf8',
          100: '#fdf8f0',
          200: '#f5f5f3',
          300: '#f0f0ed',
          400: '#e8e8e5',
          500: '#dcdcd9',
        },
        // 액센트 컬러
        accent: {
          blue: '#4285f4',
          green: '#34a853',
          purple: '#9c27b0',
        },
        // 시맨틱 컬러
        semantic: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        // 뉴모피즘을 위한 그레이 톤
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // 음악 플랫폼 테마
        vinyl: {
          black: '#1a1a1a',
          dark: '#2d2d2d',
          gray: '#4a4a4a',
          light: '#f8f8f8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        // 뉴모피즘 그림자
        'neumorphism': '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
        'neumorphism-inset': 'inset 20px 20px 60px #d1d1d1, inset -20px -20px 60px #ffffff',
        'neumorphism-dark': '20px 20px 60px #1a1a1a, -20px -20px 60px #2d2d2d',
        'neumorphism-dark-inset': 'inset 20px 20px 60px #1a1a1a, inset -20px -20px 60px #2d2d2d',
        // 턴테이블 메타포 그림자
        'vinyl': '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
        'vinyl-hover': '0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'vinyl-spin': 'vinyl-spin 33s linear infinite',
        'needle-drop': 'needle-drop 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'vinyl-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'needle-drop': {
          '0%': { transform: 'rotate(-45deg) translateY(-10px)' },
          '100%': { transform: 'rotate(0deg) translateY(0px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
