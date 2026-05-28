import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound({ expired }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 64, opacity: 0.2, fontWeight: 800 }}>◈</div>
      <h1 className="grad-text" style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, letterSpacing: -3 }}>
        {expired ? 'Link Expired' : '404'}
      </h1>
      <p style={{ color: 'var(--gray-400)', fontSize: 16 }}>
        {expired ? 'This short URL has expired and is no longer active.' : 'The short URL you followed does not exist.'}
      </p>
      <Link to="/" style={{ background: 'white', color: 'black', padding: '12px 24px', borderRadius: 4, textDecoration: 'none', fontWeight: 700 }}>
        Go Home
      </Link>
    </div>
  );
}
