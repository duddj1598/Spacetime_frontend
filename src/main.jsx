import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import './pages/Diary/Diary.css';
import AppRouter from "./routes/AppRouter"; // 라우터 가져오기

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter /> {/* App 대신 AppRouter */}
  </React.StrictMode>
);
