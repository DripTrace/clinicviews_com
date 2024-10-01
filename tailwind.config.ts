import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class", // Enable dark mode

    theme: {
        extend: {
            // spacing: {
            //     "1/10": "10%",
            // },
            // brightness: {
            //     60: ".6",
            // },
            // backgroundImage: {
            //     "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            //     "gradient-conic":
            //         "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            // },
            colors: {
                accent: "var(--accent)",
                canvas: "var(--canvas)",
                canvasText: "var(--canvasText)",
            },
        },
        // colors: {
        //     'fsc-blue-gray': '#99AAC0',
        //     'fsc-dark-blue': '#0C3C60',
        //     'fsc-light-blue': '#6EA4CE',
        //     'fsc-pale-blue': '#D1E0EB',
        //     'fsc-teal': '#1FABC7',
        //     'fsc-light-gray': '#D8DADC',
        //     'fsc-dark-gray': '#494949',
        //     'fsc-lavender': '#B3BEDC',
        //   },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
    },
    plugins: [
        require("@tailwindcss/aspect-ratio"),
        // ...
    ],
};
export default config;
