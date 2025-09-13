/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EBA766",
        secundary: "#ffffff",
        title: "#000000",
        subtitle: "#837E7E",
        category: "#6200FF",
      },
    },
  },
  plugins: [],
};
