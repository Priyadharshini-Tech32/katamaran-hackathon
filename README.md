# ◆ SNIP — URL Shortener with Analytics

> A full-stack URL shortener with real-time analytics, QR code generation, custom aliases, and link expiry.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                      │
│                   React SPA (Port 3000)                  │
│  Landing → Auth → Dashboard → Analytics                  │
└─────────────────────┬───────────────────────────────────┘
                       │ REST API (axios)
                       ▼
┌─────────────────────────────────────────────────────────┐
│              EXPRESS.JS SERVER (Port 5000)               │
│                                                          │
│  /api/auth/*     → authController (JWT)                  │
│  /api/urls/*     → urlController (CRUD + Analytics)      │
│  /:shortCode     → redirect + click tracking             │
└─────────────────────┬───────────────────────────────────┘
                       │ Mongoose ODM
                       ▼
┌─────────────────────────────────────────────────────────┐
│                     MONGODB                              │
│   users: { name, email, passwordHash, timestamps }       │
│   urls:  { originalUrl, shortCode, user, clicks,        │
│            visits[], expiresAt, isActive }               │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd urlshortener

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
# Edit .env with your values:
```

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/urlshortener
JWT_SECRET=your_long_random_secret_here
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:5000
```

### 3. Configure Frontend Environment

```bash
cd frontend
# Create .env file:
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. Run Development Servers

Terminal 1 — Backend:
```bash
cd backend
npm run dev
```

Terminal 2 — Frontend:
```bash
cd frontend
npm start
```

Open `http://localhost:3000` in your browser.

---

## ✅ Features

### Core Features
- **Authentication** — JWT-based signup/login with bcrypt password hashing
- **URL Shortening** — Unique 6-char codes via nanoid, server-side URL validation
- **Redirect Handling** — Server-side redirect with click tracking
- **Dashboard** — View, search, copy, delete, edit all links
- **Analytics** — Total clicks, last visited, 7-day click chart, recent visit history

### Bonus Features
- **Custom Aliases** — Choose your own short code (e.g. `snip.io/mylink`)
- **QR Code Generation** — Client-side QR with dark theme, downloadable PNG
- **Link Expiry** — Set expiration datetime; expired links show a proper page
- **Edit Destination** — Change the destination URL without breaking the short link
- **7-Day Click Chart** — Bar chart visualization using Recharts
- **Responsive Design** — Full mobile support

---

## 🤖 AI Planning Document

### Planning Phase
- Broke down requirements into: Auth, URL CRUD, Redirect, Analytics, UI
- Chose MongoDB for flexible visit subdocuments (embedded analytics)
- Chose nanoid for collision-resistant short codes
- Used React Router v6 with protected routes

### Architecture Decisions
1. **Embedded visits array** — Stores up to 10 recent visits per URL in the URL document itself for fast analytics without joins
2. **Server-side redirect** — The backend handles `/:shortCode` redirect, tracking every click with timestamp + user-agent
3. **JWT in localStorage** — Simple for a hackathon; in production use httpOnly cookies
4. **QR code client-side** — Generated in browser with the `qrcode` npm library, no external API needed

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Recharts, qrcode |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | validator.js |
| Styling | Custom CSS (black/white theme, CSS variables) |

---

## 🔐 Assumptions

1. Users must be authenticated to create/manage links
2. Short codes are globally unique (not per-user)
3. Click analytics stores up to the last N visits per link
4. The `BASE_URL` env var is what gets prepended to short codes
5. All passwords are hashed with bcrypt (salt rounds: 12)
6. JWT tokens expire after 7 days

---

> 🎥 **Demo Video**: [https://drive.google.com/file/d/1Aj_X_vN1DKabp3rMURbjv3VFoQ-Bl4EJ/view?usp=sharing]

---
##### My Learning Experience

This project was a great learning experience for me as I am new to full-stack application development. While building this URL Shortener application, I faced several challenges, especially in connecting the frontend, backend, and database together properly.

One of the biggest difficulties was making the application work correctly on mobile devices and handling responsive UI changes. I also faced issues during video recording, voice explanation, and demonstrating the complete workflow of the project.

Despite these challenges, I learned a lot about React, Node.js, MongoDB, API integration, routing, authentication, and analytics tracking. Solving errors and debugging the application helped me improve my problem-solving skills and confidence in development.

I would like to thank the team at Katomaran for providing this challenging and helpful hackathon task. It gave me practical experience and motivated me to learn more about real-world application development.

---
*This project is a part of a hackathon run by https://katomaran.com*
