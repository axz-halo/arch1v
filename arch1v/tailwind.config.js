/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
		'./screens/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				accent: '#ff5500',
				ink: '#111111',
				paper: '#f7f7f7',
			},
			fontFamily: {
				sans: ['System UI', 'ui-sans-serif', 'system-ui'],
			},
		},
	},
	plugins: [],
};

