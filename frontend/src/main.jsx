import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/theme.css'
import App from './App.jsx'

// Automatically route API requests to production backend when not on localhost
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.startsWith('http://localhost:5000')) {
      input = input.replace('http://localhost:5000', 'https://project-sipalaya-backend.onrender.com');
    }
    return originalFetch(input, init);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
