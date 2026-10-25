import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F7F9",
        ink: "#14213D",
        navy: { DEFAULT: "#1F3461", soft: "#3C5486", mist: "#DCE2EE", haze: "#EEF1F7" },
        steel: "#5E6878",
        rule: "#D6DAE2",
        brass: { DEFAULT: "#9A7A3F", soft: "#F3ECDF" },
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', "Palatino", '"Book Antiqua"', "Georgia", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      maxWidth: { prose: "68ch" },
    },
  },
  plugins: [],
};
export default config;
