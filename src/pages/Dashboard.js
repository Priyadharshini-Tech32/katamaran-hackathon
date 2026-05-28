import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import './Dashboard.css';

/* ─── Shorten Form ─── */
function ShortenForm({ onCreated }) {
  const { showToast } = useToast();
  const [url,     setUrl]     = useState('');
  const [alias,   setAlias]   = useState('');
  const [expires, setExpires] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [showAdv, setShowAdv] = useState(false);
  const [createdUrl, setCreatedUrl] = useState(null);

  const validate = () => {
    const e = {};
    if (!url.trim()) { e.url = 'URL is required'; return e; }
    try { new URL(url.trim()); } catch { e.url = 'Enter a valid URL starting with http:// or https://'; }
    if (alias && !/^[a-zA-Z0-9_-]{3,20}$/.test(alias))
      e.alias = 'Alias: 3–20 chars, only letters / numbers / - / _';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const payload = { originalUrl: url.trim() };
      if (alias)   payload.customAlias = alias.trim();
      if (expires) payload.expiresAt   = expires;
      const res = await api.post('/urls', payload);
      onCreated(res.data.url);
      setCreatedUrl(res.data.url);
      setUrl(''); setAlias(''); setExpires(''); setShowAdv(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create URL.';
      showToast(msg, 'error');
      setErrors({ server: msg });
    } finally { setLoading(false); }
  };

  return (
    <div className="shorten-form-card">
      <h2 className="grad-text">Shorten a URL</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="url-input-row">
          <div className="form-group flex-1">
            <input
              type="url"
              placeholder="https://your-very-long-url.com/paste-here"
              value={url}
              onChange={e => { setUrl(e.target.value); setErrors(x => ({...x, url:''})); }}
              className={`big-input ${errors.url ? 'error' : ''}`}
            />
            {errors.url && <span className="field-error">{errors.url}</span>}
          </div>
          <button type="submit" className="shorten-btn" disabled={loading}>
            {loading ? <><span className="spinner"/> Shortening…</> : 'Shorten →'}
          </button>
        </div>

        <button type="button" className="advanced-toggle" onClick={() => setShowAdv(s => !s)}>
          {showAdv ? '▲ Hide options' : '▼ Custom alias & expiry'}
        </button>

        {showAdv && (
          <div className="advanced-fields animate-fade-up">
            <div className="form-group">
              <label>Custom Alias <span className="optional">optional</span></label>
              <div className="alias-input-wrap">
                <span className="alias-prefix">snip.io/</span>
                <input type="text" placeholder="my-link" value={alias}
                  onChange={e => { setAlias(e.target.value); setErrors(x => ({...x, alias:''})); }}
                  className={errors.alias ? 'error' : ''}
                />
              </div>
              {errors.alias && <span className="field-error">{errors.alias}</span>}
            </div>
            <div className="form-group">
              <label>Expiry Date <span className="optional">optional</span></label>
              <input type="datetime-local" value={expires}
                min={new Date().toISOString().slice(0,16)}
                onChange={e => setExpires(e.target.value)}
              />
            </div>
          </div>
        )}
      </form>

      {/* ── Success Modal ── */}
      {createdUrl && (
        <div className="success-modal-overlay" onClick={() => setCreatedUrl(null)}>
          <div className="success-modal animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="success-modal-header">
              <div className="success-modal-icon">✓</div>
              <span>Link shortened!</span>
              <button className="success-modal-close" onClick={() => setCreatedUrl(null)}>✕</button>
            </div>
            <div className="success-modal-body">
              <p className="success-modal-label">Your shortened link:</p>
              <a href={createdUrl.shortUrl} target="_blank" rel="noreferrer" className="success-short-url">
                {createdUrl.shortUrl}
              </a>
            </div>
            <button
              className="success-copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(createdUrl.shortUrl).catch(() => {});
                showToast('✓ Copied to clipboard!', 'success');
                setCreatedUrl(null);
              }}
            >
              ⧉ Copy link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── URL Card ─── */
function UrlCard({ urlData, onDelete, onEdit }) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showQr,    setShowQr]    = useState(false);
  const [editing,   setEditing]   = useState(false);
  const [newUrl,    setNewUrl]    = useState(urlData.originalUrl);
  const [editErr,   setEditErr]   = useState('');
  const [deleting,  setDeleting]  = useState(false);
  const [saving,    setSaving]    = useState(false);

  // ── KEY FIX: build the correct short URL using current browser host ──
  // The backend returns shortUrl with its own host (could be localhost:5000).
  // We replace that host with the REAL host the browser uses for the backend,
  // which is window.location.hostname + port 5000.
  // Backend auto-detects LAN IP, so shortUrl is already correct
  const correctShortUrl = urlData.shortUrl;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(correctShortUrl);
      showToast('✓ Copied to clipboard!', 'success');
    } catch {
      const el = document.createElement('textarea');
      el.value = correctShortUrl;
      document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
      showToast('✓ Copied!', 'success');
    }
  };

  const generateQR = async () => {
    try {
      if (!qrDataUrl) {
        // QR encodes the correctShortUrl — works on same WiFi network
        const dataUrl = await QRCode.toDataURL(correctShortUrl, {
          width: 240, margin: 2,
          color: { dark: '#ffffff', light: '#000000' },
          errorCorrectionLevel: 'H'
        });
        setQrDataUrl(dataUrl);
      }
      setShowQr(s => !s);
      if (!qrDataUrl) showToast('✓ QR code generated!', 'success');
    } catch {
      showToast('Failed to generate QR code.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete this link?\n${correctShortUrl}`)) return;
    setDeleting(true);
    try {
      await api.delete(`/urls/${urlData.id}`);
      showToast('✓ URL deleted.', 'success');
      onDelete(urlData.id);
    } catch { showToast('Failed to delete.', 'error'); setDeleting(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditErr('');
    if (!newUrl.trim()) { setEditErr('URL cannot be empty'); return; }
    try { new URL(newUrl.trim()); } catch { setEditErr('Invalid URL — must start with http:// or https://'); return; }
    setSaving(true);
    try {
      await api.put(`/urls/${urlData.id}`, { originalUrl: newUrl.trim() });
      showToast('✓ Destination updated!', 'success');
      onEdit(urlData.id, newUrl.trim());
      setEditing(false);
    } catch (err) {
      setEditErr(err.response?.data?.message || 'Failed to update.');
    } finally { setSaving(false); }
  };

  const isExpired = urlData.expiresAt && new Date() > new Date(urlData.expiresAt);
  const displayUrl = correctShortUrl.replace(/^https?:\/\//, '');

  return (
    <div className={`url-card ${isExpired ? 'expired' : ''}`}>
      <div className="url-card-top">
        <div className="url-card-info">
          <div className="url-card-short">
            <a href={correctShortUrl} target="_blank" rel="noreferrer" className="short-link" title={correctShortUrl}>
              {displayUrl}
            </a>
            {isExpired && <span className="expired-badge">EXPIRED</span>}
          </div>

          {editing ? (
            <form onSubmit={handleEdit} className="edit-form">
              <input type="url" value={newUrl} autoFocus
                placeholder="https://new-destination.com"
                onChange={e => { setNewUrl(e.target.value); setEditErr(''); }}
                className={editErr ? 'error' : ''}
              />
              {editErr && <span className="field-error">{editErr}</span>}
              <div className="edit-actions">
                <button type="submit" className="btn-sm btn-white" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                <button type="button" className="btn-sm btn-ghost-sm" onClick={() => { setEditing(false); setNewUrl(urlData.originalUrl); setEditErr(''); }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="url-card-original" title={urlData.originalUrl}>{urlData.originalUrl}</div>
          )}

          <div className="url-card-meta">
            <span>{new Date(urlData.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
            {urlData.expiresAt && <span> · Expires {new Date(urlData.expiresAt).toLocaleDateString()}</span>}
          </div>
        </div>

        <div className="url-card-clicks">
          <span className="click-count">{urlData.clicks.toLocaleString()}</span>
          <span className="click-label">clicks</span>
        </div>
      </div>

      <div className="url-card-actions">
        <button onClick={copyToClipboard} className="action-btn">◈ Copy</button>
        <button onClick={generateQR}      className="action-btn">⬡ QR Code</button>
        <button onClick={() => navigate(`/analytics/${urlData.id}`)} className="action-btn">↗ Analytics</button>
        <button onClick={() => setEditing(x => !x)} className="action-btn">✎ Edit</button>
        <button onClick={handleDelete} className="action-btn danger" disabled={deleting}>
          {deleting ? 'Deleting…' : '✕ Delete'}
        </button>
      </div>

      {showQr && qrDataUrl && (
        <div className="qr-panel animate-fade-up">
          <img src={qrDataUrl} alt="QR Code" />
          <div className="qr-info">
            <p className="qr-title">Scan to open link</p>
            <p className="qr-url">{correctShortUrl}</p>
            {correctShortUrl.includes('localhost') ? (
              <p className="qr-hint warn">
                ⚠ QR uses <strong>localhost</strong> — phone won't open it.<br/>
                To scan on phone: open this app in browser using your computer's IP address instead of localhost.<br/>
                e.g. <strong>http://192.168.1.x:3000</strong>
              </p>
            ) : (
              <p className="qr-hint ok">✓ Works on any device on the same network</p>
            )}
            <a href={qrDataUrl} download={`qr-snip-${urlData.shortCode || 'link'}.png`} className="btn-sm btn-white" style={{display:'inline-block',marginTop:10}}>
              ↓ Download QR PNG
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Dashboard Page ─── */
export default function Dashboard() {
  const { user } = useAuth();
  const [urls,    setUrls]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  const fetchUrls = useCallback(async () => {
    try { const res = await api.get('/urls'); setUrls(res.data.urls); }
    catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUrls(); }, [fetchUrls]);

  const handleCreated = url  => setUrls(p => [url, ...p]);
  const handleDelete  = id   => setUrls(p => p.filter(u => u.id !== id));
  const handleEdit    = (id, dest) => setUrls(p => p.map(u => u.id === id ? {...u, originalUrl: dest} : u));

  const filtered     = urls.filter(u =>
    u.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
    (u.shortCode||'').toLowerCase().includes(search.toLowerCase())
  );
  const totalClicks  = urls.reduce((s, u) => s + u.clicks, 0);
  const activeLinks  = urls.filter(u => !u.expiresAt || new Date() < new Date(u.expiresAt)).length;

  return (
    <div className="dashboard">
      {/* Floating ambient background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <Navbar />
      <div className="dashboard-inner">

        <div className="dashboard-header animate-fade-up">
          <div>
            <h1 className="grad-text">Dashboard</h1>
            <p className="dash-sub">Welcome back, <strong>{user?.name}</strong></p>
          </div>
          <div className="stats-row">
            <div className="stat-pill"><span className="stat-num">{urls.length}</span><span className="stat-lbl">Total Links</span></div>
            <div className="stat-pill"><span className="stat-num">{activeLinks}</span><span className="stat-lbl">Active</span></div>
            <div className="stat-pill"><span className="stat-num">{totalClicks.toLocaleString()}</span><span className="stat-lbl">Clicks</span></div>
          </div>
        </div>

        <div className="animate-fade-up" style={{animationDelay:'0.1s'}}>
          <ShortenForm onCreated={handleCreated} />
        </div>

        <div className="urls-section animate-fade-up" style={{animationDelay:'0.2s'}}>
          <div className="urls-header">
            <h2>Your Links <span className="urls-count">{filtered.length}</span></h2>
            <input type="search" placeholder="Search links…" value={search}
              onChange={e => setSearch(e.target.value)} className="search-input" />
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" style={{width:32,height:32}}/><p>Loading…</p></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <p>{search ? 'No links match your search.' : 'No links yet — shorten your first URL above!'}</p>
            </div>
          ) : (
            <div className="urls-list">
              {filtered.map((url, i) => (
                <div key={url.id} className="animate-fade-up" style={{animationDelay:`${i*0.05}s`}}>
                  <UrlCard urlData={url} onDelete={handleDelete} onEdit={handleEdit} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
