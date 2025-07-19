/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './views/**/*.ejs', // Scan EJS files in the views directory
    './public/**/*.html', // (optional) If you have other HTML files in the public directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
