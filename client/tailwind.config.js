/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainColor: "#206c9e",
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      }
    },
  },
  plugins: [
    forms,
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-hide": {
          /* Firefox */
          "scrollbar-width": "none",
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Chrome, Safari and Opera */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
