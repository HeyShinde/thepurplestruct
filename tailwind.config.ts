import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'silkscreen-regular': ['var(--font-silkscreen)', 'Silkscreen', 'sans-serif'],
        'silkscreen-bold': ['var(--font-silkscreen)', 'Silkscreen', 'sans-serif'],
        'nabla': ['Nabla', 'system-ui'],
      },
      screens: {
        'tablet': '900px',
      },
    },
    fontSize: {
      'nabla': ['1rem', {
        fontFamily: 'Nabla',
        fontOpticalSizing: 'auto',
        fontWeight: '400',
        fontStyle: 'normal',
        fontVariationSettings: '"EDPT" 100, "EHLT" 12',
      }],
    },
  },
  plugins: [],
};

export default config; 