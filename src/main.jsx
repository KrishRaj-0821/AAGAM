import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AAGAM UI Error Caught by Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          fontFamily: 'Inter, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '550px',
            backgroundColor: '#ffffff',
            padding: '2.5rem',
            borderRadius: '1.25rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              margin: '0 auto 1.25rem'
            }}>⚠️</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
              AAGAM Portal — Temporary Display Notice
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              The portal encountered an unexpected runtime state. Your local session has been protected. Please reload to restore your dashboard.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('aagam_auth_user');
                window.location.reload();
              }}
              style={{
                backgroundColor: '#71873f',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.75rem 1.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(113, 135, 63, 0.4)'
              }}
            >
              Reset & Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
