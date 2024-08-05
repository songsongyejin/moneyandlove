/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "350px": "350px",
      },
      boxShadow: {
        btn: "4px 4px 5px 2px rgba(0, 0, 0, 0.40)",
      },
      backgroundImage: {
        "main-bg": "url('./src/assets/main_bg.png')",
        "love-bg": "url('./src/assets/love_bg.jpg')",
        "mafia-bg": "url('./src/assets/mafia_bg.png')",
      },
      colors: {
        "btn-color": "#8B6CAC",
        "chatRoomMain-color": "#160F1D",
        "online-color": "#24ff66",
        "offline-color": "#666666",
        "custom-purple-color": "#8B6CAC",
        "chatRoom-color": "#F8F1FD",
        "chat-color": "#D1C4DE",
        primary: {
          DEFAULT: "#2bca43",
        },
      },
      dropShadow: {
        custom:
          "0 0 2px rgba(255, 255, 255, 0.7), 0 0 1px rgba(255, 255, 255, 0.7), 0 0 1px rgba(255, 255, 255, 0.7)",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-custom": {
          textShadow: "10px 10px 5px rgba(0, 0, 0, 0.25)",
        },
        ".text-stroke-custom": {
          "-webkit-text-stroke-width": "0.01px",
          "-webkit-text-stroke-color": "#8B6CAC",
        },
        ".drop-shadow-custom": {
          filter:
            "drop-shadow(0 0 2px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 1px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 1px rgba(255, 255, 255, 0.7))",
        },
        ".color-online": {
          color: "rgb(36, 255, 102)",
        },
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "#8B6CAC transparent",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#8B6CAC",
            borderRadius: "20px",
            border: "3px solid transparent",
          },
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
