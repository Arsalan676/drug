import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import App from './App.jsx'
import StitchScreenViewer from './StitchScreenViewer.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999, display: 'flex', gap: '10px' }}>
        <Link to="/" style={{ background: '#2d3748', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', color: 'white', border: '1px solid #00d9ff' }}>Main App</Link>
        <Link to="/designs" style={{ background: '#2d3748', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', color: 'white', border: '1px solid #6366f1' }}>Design Refs</Link>
      </div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/designs" element={<StitchScreenViewer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
