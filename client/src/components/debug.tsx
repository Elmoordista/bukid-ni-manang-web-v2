import React from 'react';

export default function Debug({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0,
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '1rem',
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <pre>
        {JSON.stringify({
          location: window.location.pathname,
          authenticated: localStorage.getItem('auth_token') ? true : false,
          userRole: localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data') || '{}').role : null,
        }, null, 2)}
      </pre>
      {children}
    </div>
  );
}