import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-4" />

      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-grid-bg" />

        <div className="hero-inner">
          {/* Left: Text content */}
          <div className="hero-content animate-fade-up">
            <div className="hero-badge">
              <span className="badge-dot" />
              <span>URL Shortener · Real-time Analytics</span>
            </div>

            <h1 className="hero-title">
              <span className="grad-text">Links that</span>
              <br />
              <span className="grad-text">work smarter</span>
            </h1>

            <p className="hero-desc">
              Shorten, share, and track your URLs with powerful analytics.
              Real-time insights for every link you create.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="btn-primary">
                Get started free →
              </Link>
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Links created</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-number">Free</span>
                <span className="stat-label">Always</span>
              </div>
            </div>
          </div>

          {/* Right: Mockup */}
          <div className="hero-visual animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="mockup-card animate-glow">
              <div className="mockup-header">
                <div className="dot red" /><div className="dot yellow" /><div className="dot green" />
                <span className="mockup-url-bar">snip.io/dashboard</span>
              </div>

              <div className="mockup-body">
                <div className="mockup-label">Recent links</div>
                {[
                  { orig: 'very-long-website-url.com/some/path', short: 'snip.io/3kx9f', clicks: '1,204' },
                  { orig: 'medium.com/article/how-to-build', short: 'snip.io/art4m', clicks: '847' },
                  { orig: 'docs.google.com/document/d/abc', short: 'snip.io/mydoc', clicks: '312' },
                ].map((row, i) => (
                  <div key={i} className="mockup-url-row">
                    <div className="mockup-row-left">
                      <span className="url-orig">{row.orig}</span>
                      <span className="url-short">{row.short}</span>
                    </div>
                    <div className="url-clicks">↗ {row.clicks}</div>
                  </div>
                ))}

                <div className="mockup-chart-section">
                  <div className="mockup-label">Clicks this week</div>
                  <div className="mockup-chart">
                    {[40, 60, 30, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="chart-bar-wrap">
                        <div className="chart-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-inner">
          <div className="section-header">
            <h2 className="section-title grad-text">Everything you need</h2>
            <p className="section-sub">Powerful tools to manage and track every link you share.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '⚡', title: 'Instant Shortening', desc: 'Generate short URLs in milliseconds with guaranteed uniqueness', color: '#7c3aed' },
              { icon: '📊', title: 'Deep Analytics', desc: 'Track clicks, timestamps, and visit history per link', color: '#06b6d4' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your links are protected behind authenticated accounts', color: '#f43f5e' },
              { icon: '✏️', title: 'Custom Aliases', desc: 'Create memorable short codes like snip.io/mybrand', color: '#f59e0b' },
              { icon: '⏰', title: 'Link Expiry', desc: 'Set expiration dates to control your link lifetime', color: '#10b981' },
              { icon: '📱', title: 'QR Codes', desc: 'Generate QR codes for every shortened URL instantly', color: '#a855f7' },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ '--card-color': f.color }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="grad-text">Ready to shorten?</h2>
          <p>Join thousands of users managing their links smarter.</p>
          <Link to="/signup" className="btn-primary">Create free account →</Link>
        </div>
      </section>

      <footer className="footer">
        <span className="grad-text footer-brand">SNIP</span>
        <span className="footer-copy">© {new Date().getFullYear()} · URL Shortener</span>
        <span className="footer-hack">This project is a part of a hackathon run by <a href="https://katomaran.com" target="_blank" rel="noreferrer">katomaran.com</a></span>
      </footer>
    </div>
  );
}
