import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import './Profile.css';

function EyeIcon({ open }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

// Detect gender from name heuristics (common suffixes/names)
function detectGender(name) {
  if (!name) return 'neutral';
  const lower = name.trim().toLowerCase().split(' ')[0];
  const femaleNames = ['priya','ananya','divya','sneha','pooja','lakshmi','meera','kavya','nithya','rekha','sita','gita','uma','asha','nisha','riya','tanya','shreya','diya','aishwarya','deepa','radha','sunita','geeta','seetha','yamini','suganya','bhavani','gomathi','saranya','sindhu','vimala','malathi','padmini','latha','revathi','chandrika','gowri','savitha','pavithra','keerthi','ranjitha','sowmya','janani','abinaya','vaishnavi','nivetha','kiruthika','monisha','subashini','hema','jayanthi','kamala','nalini','saraswathi','thenmozhi','usha','vijayalakshmi','selvi','devi','malar','kavitha','radhika','sangeetha','rohini','sumathi','girija','mythili','kalyani','arthi','narmadha','ponmalar','soundarya','jothika','bharathi','geetha','manimegalai','saroja','sivakami','chitra','dharani','gomathy','rani','ambika','saradha','vidhya','amudha','muthumari','eswari','mangai','sarala','vasantha','kokila','yamuna','sarathi','pushpa','santha','thulasi','thulasimani','hemamalini','vasuki','muthu','muthulakshmi','poomalar','amutha','sakunthala','karpagam','megala','oviya','gayathri','gayatri','hamsa','indhira','indhu','indira','iswarya','jansi','jasmine','jaya','jayanthi','jothilakshmi','kalpana','kanimozhi','karuna','kumari','kumutha','lakshana','lavanya','leela','leelavathi','letchumy','lilavathi','logambal','madhavi','maheswari','mangalambal','mangayarkarasi','manjula','manorama','mariammal','meenakshi','meenakshisundari','mohana','mugilvahini','murugeswari','mythreyi','nagalakshmi','nagamani','nageswari','nallamma','namitha','nandhini','nandita','nanmalar','narayani','neelaveni','nila','nilavoli','niraimathi','nithyasree','ovvai','parimala','parkavi','parvathi','pathmavathi','pattammal','ponni','ponniyin','premalatha','priyadharshini','priyadharshni','priyal','priyanka','punitha','pushpavalli','rajalakshmi','rajamani','rajeswari','rajini','ramalakshmi','ramya','revathi','saambavi','sabari','sadhanaa','sakthi','salma','sandhya','sangamithra','sathyapriya','saundharya','saveetha','selvarani','shakthi','shakthipriya','shaktivel','shanthi','sharmila','shenbagam','shobana','shobha','shobhana','shreedevi','shridevi','shreelatha','shridevi','sridevi','sriya','subha','subhashini','sujata','sujatha','sulochana','sumaiya','sundaravalli','sundari','supriya','surekha','susheela','swetha','swathi','tamilarasi','tamilselvi','tamilsolai','tamilvendhan','tanishka','tara','tharani','thenmalar','thilaga','thilagavathi','umamaheswari','usha','usharani','valli','vallisri','vani','vennila','vidhyalakshmi','vijaya','vijayabharathi','vijayarani','vinodhini','vinotha','vishali','vishalini','yamuna','yashoda','yuvrani','alice','emma','olivia','sophia','ava','isabella','mia','charlotte','amelia','harper','evelyn','abigail','emily','ella','elizabeth','camila','luna','sofia','aria','scarlett','victoria','madison','layla','ellie','zoe','nora','lily','eleanor','hannah','lillian','addison','aubrey','aurora','natalie','chloe','sarah','penelope','skylar','leah','paisley','savannah','stella','bella','claire','ariana','lucy','anna','samantha','maya','julia','naomi','aaliyah','elena','maria','alyssa','brooke','alexandra'];
  const maleNames = ['ram','krishna','arjun','vijay','suresh','rajesh','kumar','siva','selvam','murugan','ganesh','kartik','arun','anand','deepak','praveen','vinoth','senthil','karthick','bala','ravi','manoj','dinesh','surya','vivek','shankar','sathish','prakash','venkat','muthukumar','sakthivel','vignesh','esakki','thiru','kathir','vasanth','naveen','pradeep','hari','balaji','logesh','pandian','perumal','boopalan','palani','chandra','gopi','iyappan','durai','bharath','velu','nandha','ramu','chelvan','murugesan','saravanan','sivakumar','anbalagan','ilango','kalaivanan','loganathan','manimaran','marimuthu','nattamai','palanisamy','radhakrishnan','rajkumar','raman','ramesh','ranjith','sadagopan','saminathan','sekar','selvakumar','shanmugam','sivasubramanian','sridhar','subramanian','sundaram','thirumalai','thirunavukkarasu','thiyagarajan','ulagasingam','vadivelmurugan','valliappan','vasudevan','venkatesh','venkatachalam','velmurugan','vijayakumar','vimalraj','vinodhkumar','john','james','william','oliver','benjamin','elijah','lucas','mason','ethan','alexander','henry','jackson','sebastian','aiden','matthew','samuel','david','joseph','carter','owen','wyatt','john','jack','luke','jayden','dylan','grayson','levi','isaac','gabriel','julian','mateo','anthony','jaxon','lincoln','josh','christopher','andrew','theodore','caleb','ryan','nathan','thomas','leo','isaiah','charles','josiah','hudson','christian','hunter','connor','eli','ezra','aaron','landon','adrian','jonathan','nolan','jeremiah','easton','elias','colton','cameron','carson','robert','angel','maverick','nicholas','dominic','jaxson','greyson','adam','ian','austin','santiago','jordan','cooper','brayden','roman','evan','ezekiel','xavier','jose','jace','jameson','kevin','ayden','bentley','zachary','everett','parker','kayden','miles','sawyer','jason','declan','weston','axel','miles','ryder','micah','vincent','cole','brody','alex','eric','steven','sean','brandon','dylan'];
  if (femaleNames.includes(lower)) return 'female';
  if (maleNames.includes(lower)) return 'male';
  // fallback check ending patterns
  if (['a','i','ee','ni','vi','li','ey','ie'].some(e => lower.endsWith(e))) return 'female';
  return 'male';
}

function BoyAvatar() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boyBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#boyBg)"/>
      {/* Body */}
      <rect x="28" y="68" width="44" height="28" rx="8" fill="rgba(255,255,255,0.25)"/>
      {/* Head */}
      <circle cx="50" cy="42" r="20" fill="rgba(255,220,185,1)"/>
      {/* Hair - boy style short */}
      <ellipse cx="50" cy="28" rx="20" ry="10" fill="#4a2e1a"/>
      <rect x="30" y="28" width="40" height="8" rx="2" fill="#4a2e1a"/>
      {/* Eyes */}
      <circle cx="43" cy="43" r="2.5" fill="#2d1b00"/>
      <circle cx="57" cy="43" r="2.5" fill="#2d1b00"/>
      {/* Smile */}
      <path d="M43 50 Q50 56 57 50" stroke="#c0784a" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function GirlAvatar() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="girlBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e"/>
          <stop offset="100%" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#girlBg)"/>
      {/* Body */}
      <rect x="28" y="68" width="44" height="28" rx="8" fill="rgba(255,255,255,0.25)"/>
      {/* Head */}
      <circle cx="50" cy="42" r="20" fill="rgba(255,220,185,1)"/>
      {/* Hair - girl style long */}
      <ellipse cx="50" cy="26" rx="21" ry="11" fill="#3d1f0a"/>
      <rect x="28" y="26" width="8" height="28" rx="4" fill="#3d1f0a"/>
      <rect x="64" y="26" width="8" height="28" rx="4" fill="#3d1f0a"/>
      {/* Hair bow */}
      <ellipse cx="50" cy="22" rx="10" ry="5" fill="#f43f5e"/>
      <circle cx="50" cy="22" r="3" fill="#ff6b8a"/>
      {/* Eyes */}
      <circle cx="43" cy="43" r="2.5" fill="#2d1b00"/>
      <circle cx="57" cy="43" r="2.5" fill="#2d1b00"/>
      {/* Eyelashes */}
      <line x1="40" y1="40" x2="38" y2="37" stroke="#2d1b00" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="43" y1="39" x2="42" y2="36" stroke="#2d1b00" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="46" y1="40" x2="46" y2="37" stroke="#2d1b00" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="54" y1="40" x2="54" y2="37" stroke="#2d1b00" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="57" y1="39" x2="58" y2="36" stroke="#2d1b00" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="60" y1="40" x2="62" y2="37" stroke="#2d1b00" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Smile */}
      <path d="M43 50 Q50 57 57 50" stroke="#c0784a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Blush */}
      <circle cx="38" cy="48" r="4" fill="rgba(255,100,100,0.25)"/>
      <circle cx="62" cy="48" r="4" fill="rgba(255,100,100,0.25)"/>
    </svg>
  );
}

function NeutralAvatar({ initials }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="neutralBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="50%" stopColor="#06b6d4"/>
          <stop offset="100%" stopColor="#f43f5e"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#neutralBg)"/>
      <text x="50" y="57" textAnchor="middle" fontSize="30" fontWeight="800" fill="white" fontFamily="Syne, sans-serif">{initials}</text>
    </svg>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, activeLinks: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const [pwForm, setPwForm]   = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const gender = detectGender(user?.name);
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : '?';

  useEffect(() => {
    api.get('/urls').then(res => {
      const urls = res.data.urls || [];
      const totalClicks = urls.reduce((s, u) => s + u.clicks, 0);
      const activeLinks = urls.filter(u => !u.expiresAt || new Date() < new Date(u.expiresAt)).length;
      setStats({ totalLinks: urls.length, totalClicks, activeLinks });
    }).catch(() => {}).finally(() => setLoadingStats(false));
  }, []);

  const validatePw = () => {
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (!pwForm.newPassword)     errs.newPassword = 'New password is required';
    else if (pwForm.newPassword.length < 6) errs.newPassword = 'Min. 6 characters';
    if (!pwForm.confirmPassword) errs.confirmPassword = 'Please confirm your new password';
    else if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (pwForm.currentPassword && pwForm.newPassword && pwForm.currentPassword === pwForm.newPassword)
      errs.newPassword = 'New password must differ from current';
    return errs;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = validatePw();
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwErrors({});
    setPwLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      showToast('Password changed successfully!', 'success');
      setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password.';
      showToast(msg, 'error');
      setPwErrors({ server: msg });
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Logged out successfully.', 'success');
  };

  const setpw = field => e => {
    setPwForm(f => ({ ...f, [field]: e.target.value }));
    setPwErrors(er => ({ ...er, [field]: '' }));
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-inner">

        {/* Header card */}
        <div className="profile-hero animate-fade-up">
          <div className="profile-avatar-big">
            {gender === 'male' && <BoyAvatar />}
            {gender === 'female' && <GirlAvatar />}
            {gender === 'neutral' && <NeutralAvatar initials={initials} />}
          </div>
          <div className="profile-hero-info">
            <h1 className="grad-text">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
              <span className="profile-badge">◆ Active Member</span>
              <span className="free-badge"><span className="dollar-icon">$</span> FREE PLAN</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats animate-fade-up" style={{ animationDelay:'0.1s' }}>
          <div className="pstat-card">
            <span className="pstat-icon">🔗</span>
            <span className="pstat-num">{loadingStats ? '—' : stats.totalLinks}</span>
            <span className="pstat-label">Total Links Created</span>
          </div>
          <div className="pstat-card">
            <span className="pstat-icon">✅</span>
            <span className="pstat-num">{loadingStats ? '—' : stats.activeLinks}</span>
            <span className="pstat-label">Active Links</span>
          </div>
          <div className="pstat-card">
            <span className="pstat-icon">↗</span>
            <span className="pstat-num">{loadingStats ? '—' : stats.totalClicks.toLocaleString()}</span>
            <span className="pstat-label">Total Clicks</span>
          </div>
        </div>

        {/* Account info */}
        <div className="profile-section animate-fade-up" style={{ animationDelay:'0.15s' }}>
          <h2 className="section-heading">Account Info</h2>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Account ID</span>
              <span className="info-value mono">{user?.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status</span>
              <span className="info-value"><span className="status-dot" />Active</span>
            </div>
            <div className="info-row">
              <span className="info-label">Plan</span>
              <span className="info-value">
                <span className="free-badge" style={{ fontSize: 11 }}>
                  <span className="dollar-icon">$</span> FREE — Unlimited
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="profile-section animate-fade-up" style={{ animationDelay:'0.2s' }}>
          <h2 className="section-heading">Change Password</h2>
          <form onSubmit={handlePasswordChange} noValidate className="pw-form">
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-wrapper">
                <input
                  type={showCur ? 'text' : 'password'} placeholder="Enter current password"
                  value={pwForm.currentPassword} onChange={setpw('currentPassword')}
                  className={pwErrors.currentPassword ? 'error' : ''}
                />
                <button type="button" className="eye-btn" onClick={() => setShowCur(s => !s)} tabIndex={-1}>
                  <EyeIcon open={showCur} />
                </button>
              </div>
              {pwErrors.currentPassword && <span className="field-error">{pwErrors.currentPassword}</span>}
            </div>
            <div className="pw-row">
              <div className="form-group">
                <label>New Password</label>
                <div className="password-wrapper">
                  <input
                    type={showNew ? 'text' : 'password'} placeholder="Min. 6 characters"
                    value={pwForm.newPassword} onChange={setpw('newPassword')}
                    className={pwErrors.newPassword ? 'error' : ''}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowNew(s => !s)} tabIndex={-1}>
                    <EyeIcon open={showNew} />
                  </button>
                </div>
                {pwErrors.newPassword && <span className="field-error">{pwErrors.newPassword}</span>}
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-wrapper">
                  <input
                    type={showConf ? 'text' : 'password'} placeholder="Repeat new password"
                    value={pwForm.confirmPassword} onChange={setpw('confirmPassword')}
                    className={pwErrors.confirmPassword ? 'error' : ''}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowConf(s => !s)} tabIndex={-1}>
                    <EyeIcon open={showConf} />
                  </button>
                </div>
                {pwErrors.confirmPassword && <span className="field-error">{pwErrors.confirmPassword}</span>}
              </div>
            </div>
            {pwErrors.server && <p className="field-error">{pwErrors.server}</p>}
            <button type="submit" className="btn-save" disabled={pwLoading}>
              {pwLoading ? <><span className="spinner" /> Changing...</> : 'Change Password →'}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="profile-section danger-zone animate-fade-up" style={{ animationDelay:'0.25s' }}>
          <h2 className="section-heading">Session</h2>
          <div className="danger-row">
            <div>
              <p className="danger-title">Log out of your account</p>
              <p className="danger-desc">You can always log back in anytime.</p>
            </div>
            <button onClick={handleLogout} className="btn-logout">Logout →</button>
          </div>
        </div>

      </div>
    </div>
  );
}
