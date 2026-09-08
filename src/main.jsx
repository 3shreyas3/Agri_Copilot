import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'leaflet/dist/leaflet.css';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('AgriCopilot Runtime Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: '600px', width: '100%', background: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#b91c1c', marginBottom: '8px' }}>Application Error</h2>
            <p style={{ fontSize: '14px', color: '#475569', marginBottom: '16px' }}>Something went wrong while rendering AgriCopilot.</p>
            <pre style={{ background: '#f1f5f9', color: '#0f172a', padding: '12px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto', marginBottom: '16px' }}>
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#059669', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
            >
              Reload Application
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
);
