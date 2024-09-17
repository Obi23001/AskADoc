/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#40A9FF',
      },
      fontSize: {
        xxs: "0.625rem", // Example size for extra extra small text
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
