import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./pages/Diary/Diary.css";
import AppRouter from "./routes/AppRouter";
import { NotificationProvider } from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotificationProvider>
      <AppRouter />
    </NotificationProvider>
  </React.StrictMode>
);
