const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	daisyui: {
		themes: [
			{
				light: {
					"primary": "#1e1e26",
					"secondary": "#000000",
					"accent": colors.yellow[600],
					"neutral": "#e5e5e5",
					"base-100": "#fafafa",
					"info": colors.blue[400],
					"success": colors.green[400],
					"warning": colors.yellow[400],
					"error": colors.red[400]
				}
			},
			{
				dark: {
					"primary": "#fafafa",
					"secondary": "#272731",
					"accent": colors.yellow[500],
					"neutral": "#1e1e26",
					"base-100": "#30303d",
					"info": colors.blue[400],
					"success": colors.green[400],
					"warning": colors.yellow[400],
					"error": colors.red[400]
				}
			}
		]
	},
	// theme: {
	// 	extend: {
	// 		backgroundImage: {
	// 			"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
	// 			"gradient-conic":
	// 				"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
	// 		},
	// 		backgroundColor: {
	// 			"dark": "#30303d",
	// 			"light": "#fafafa",
	// 			"secondary-dark": "#1e1e26",
	// 			"secondary-light": "#e5e5e5"
	// 		},
	// 		stroke: {
	// 			"dark": "#fafafa",
	// 			"light": "#30303d",
	// 			"secondary-light": "#1e1e26",
	// 			"secondary-dark": "#e5e5e5"
	// 		},
	// 		textColor: {
	// 			dark: "#fefefe",
	// 			light: "#000000"
	// 		},
	// 		colors: {
	// 			accent: colors.blue[400]
	// 		}
	// 	}
	// },
	plugins: [require("@headlessui/tailwindcss"), require("daisyui")]
};
