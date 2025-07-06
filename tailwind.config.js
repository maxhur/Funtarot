/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        wave: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-0.3em)" },
        },
        floating: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-0.5rem)" },
        },
        glowFade: {
          "0%": {
            boxShadow:
              "0 0 0 3px rgba(255,255,255,0.95), 0 0 14px 6px rgba(255,255,255,0.8)",
            backgroundColor: "rgba(255,255,255,0.15)",
            borderColor: "rgba(255,255,255,0.9)",
          },
          /* ease out */
          "60%": {
            boxShadow:
              "0 0 0 5px rgba(255,255,255,0.4), 0 0 22px 10px rgba(255,255,255,0.25)",
            backgroundColor: "rgba(255,255,255,0.08)",
          },
          /* fully faded */
          "100%": {
            boxShadow: "0 0 0 0 rgba(255,255,255,0)",
            borderColor: "white", // normal border colour
          },
        },
      },
      animation: {
        wave: "wave 1s ease-in-out infinite",
        floating: "floating 3s ease-in-out infinite",
        glow: "glowFade 1.6s ease-out forwards",
      },
    },
  },
  plugins: [
    require("tailwindcss/nesting"),
    require("tailwindcss"),
    require("autoprefixer"),
  ],
};
