/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        btn: "4px 4px 5px 2px rgba(0, 0, 0, 0.40)",
      },

      backgroundImage: {
        "main-bg": "url('./src/assets/main_bg.png')",
      },
      colors: {
        "btn-color": "#8B6CAC",
        primary: {
          DEFAULT: "#2bca43",
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-custom": {
          textShadow: "10px 10px 5px rgba(0, 0, 0, 0.25)",
        },
        ".text-stroke-custom": {
          "-webkit-text-stroke-width": "0.01px",
          "-webkit-text-stroke-color": "#8B6CAC",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
