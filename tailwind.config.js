/** @type {import('tailwindcss').Config} */
export default {
  // src 폴더의 모든 .js, .jsx, .ts, .tsx 파일을 스캔하도록 설정
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}