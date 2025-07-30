/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,md,mdx}',
    './public/**/*.md',
  ],
  theme: {
    extend: {
      // Font configuration moved to CSS @theme block in globals.css for v4
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 