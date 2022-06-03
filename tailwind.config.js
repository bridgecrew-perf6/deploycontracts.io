module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat'],
        'space-grotesk': ['Space Grotesk'],
      },
      fontSize: {
        xs: ['0.875rem', '2rem'], // 14px 32px
        sm: ['1rem', '2rem'], // 16px 32px
        base: ['1.125rem', '2rem'], // 18px 32px
        lg: ['1.5rem', '1.914rem'], // 24px 30.62px
        xl: ['3rem', '3.828rem'], // 48px 61.25px
        h1: ['4rem', '5.1rem'], //64px 81.68px
        'h2-sm': ['2.5rem', '3rem'], // 40px 48px
        'h2-md': ['3.5rem', '4rem'], // 56px 64px
      },
      weight: {
        normal: 400,
        medium: 500,
        bold: 700,
      },
      colors: {
        gray: {
          100: '#DCE2F2',
          200: '#6075AA',
          300: '#7A8297',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
