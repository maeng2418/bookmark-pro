import baseConfig from '../../packages/ui/tailwind.config.base.js'

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    "./popup.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require('tailwindcss-animate')],
}