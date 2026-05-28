import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { useToast } from '../context/ToastContext';
import './Analytics.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        <p style={{ color: 'var(--gray-400)', marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'white', fontWeight: 700 }}>{payload[0].value} clicks</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/urls/${id}/analytics`)
      .then(res => setData(res.data.url))
      .catch(() => showToast('Failed to load analytics.', 'error'))
      .finally(() => setLoading(false));
  }, [id, showToast]);

  const copyUrl = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.shortUrl)
      .then(() => showToast('Copied!', 'success'))
      .catch(() => showToast('Copy failed.', 'error'));
  };

  if (loading) return (
    <div className="analytics-page">
      <Navbar />
      <div className="analytics-loading">
        <div className="spinner" style={{ width: 36, height: 36 }} />
        <p>Loading analytics...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="analytics-page">
      <Navbar />
      <div className="analytics-loading">
        <p>URL not found.</p>
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
      </div>
    </div>
  );

  const maxClicks = Math.max(...(data.dailyTrend?.map(d => d.clicks) || [1]), 1);

  return (
    <div className="analytics-page">
      <Navbar />
      <div className="analytics-inner">
        <div className="analytics-header animate-fade-up">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1 className="grad-text">Analytics</h1>
          <div className="analytics-url-info">
            <div className="analytics-short-url">
              <a href={data.shortUrl} target="_blank" rel="noreferrer">{data.shortUrl}</a>
              <button onClick={copyUrl} className="copy-btn-sm">Copy</button>
            </div>
            <div className="analytics-orig-url">{data.originalUrl}</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="analytics-stats animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="analytics-stat-card">
            <span className="astat-num">{data.clicks.toLocaleString()}</span>
            <span className="astat-label">Total Clicks</span>
          </div>
          <div className="analytics-stat-card">
            <span className="astat-num">{data.lastVisited ? new Date(data.lastVisited).toLocaleDateString() : '—'}</span>
            <span className="astat-label">Last Visited</span>
          </div>
          <div className="analytics-stat-card">
            <span className="astat-num">{new Date(data.createdAt).toLocaleDateString()}</span>
            <span className="astat-label">Created On</span>
          </div>
          <div className="analytics-stat-card">
            <span className="astat-num">{data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : '∞'}</span>
            <span className="astat-label">Expires</span>
          </div>
        </div>

        {/* Chart */}
        <div className="analytics-chart-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h2>Clicks — Last 7 Days</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.dailyTrend} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="clicks" fill="url(#barGrad)" radius={[3, 3, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent visits */}
        <div className="analytics-visits animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <h2>Recent Visits</h2>
          {data.recentVisits && data.recentVisits.length > 0 ? (
            <div className="visits-table">
              <div className="visits-head">
                <span>Timestamp</span>
                <span>User Agent</span>
                <span>IP</span>
              </div>
              {data.recentVisits.map((v, i) => (
                <div key={i} className="visit-row animate-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <span className="visit-time">{new Date(v.timestamp).toLocaleString()}</span>
                  <span className="visit-ua">{v.userAgent ? v.userAgent.substring(0, 60) + (v.userAgent.length > 60 ? '...' : '') : 'Unknown'}</span>
                  <span className="visit-ip">{v.ip || 'Unknown'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-visits">No visits recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
