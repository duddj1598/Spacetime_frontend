import React from 'react';
import ReactDOM from 'react-dom/client';
// ⭐️ 이 라인을 통해 App.jsx 파일의 App 컴포넌트를 가져옵니다. 
import App from './App.jsx'; 
import './index.css';

// 라우팅을 위한 BrowserRouter 임포트
import { BrowserRouter } from 'react-router-dom'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* ⭐️ 여기서 App을 사용합니다. App이 정의되어 있어야 합니다. */}
      <App /> 
    </BrowserRouter>
  </React.StrictMode>,
);