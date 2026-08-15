import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Suppress benign browser media interruption errors (e.g. play() interrupted by pause())
window.addEventListener('unhandledrejection', (event) => {
  if (event?.reason?.name === 'AbortError' || event?.reason?.message?.includes('play()')) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
