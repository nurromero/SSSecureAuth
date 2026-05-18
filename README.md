# SSSecureAuth

Secure document sharing web application.

## Tech Stack
- **Frontend:** Vue 3 + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Auth:** Google OAuth 2.0 + OpenID Connect

## Setup

### 1. Clone the repo
```bash
git clone <https://github.com/nurromero/SSSecureAuth.git>
cd SSSecureAuth
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables
Copy `backend/.env.example` to `backend/.env` and fill in:
- `PEPPER` - a long random secret string
- `GOOGLE_CLIENT_ID` - from Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - from Google Cloud Console
- JWT keys (generated via the key generation script)

## Project Structure
```
SSSecureAuth/
├── backend/
│   ├── src/
│   │   ├── routes/       ← API endpoints
│   │   ├── middleware/   ← Auth checks, error handling
│   │   ├── db/           ← Database setup and schema
│   │   └── server.js     ← Entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── views/        ← Pages (Login, Register, Dashboard)
    │   ├── components/   ← Reusable UI components
    │   └── router/       ← Page routing
    └── vite.config.js
```
