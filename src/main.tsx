import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthInitializer } from './components/auth/AuthInitializer';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </BrowserRouter>
  </React.StrictMode>
);
