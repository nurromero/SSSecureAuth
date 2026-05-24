# SSSecureAuth

Secure document sharing web application.

## Tech Stack
- **Frontend:** Vue 3 + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite using sql.js
- **Auth:** Local authentication with Argon2 password hashing and JWT
- **Security:** Helmet, rate limiting, backend access control


Projektet demonstrerer lokal authentication, password hashing med Argon2, JWT-baseret login og backend access control til delte dokumenter.


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
The backend uses a `.env` file for secrets such as `PEPPER` and `JWT_SECRET`.  

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
    │   ├── views/        ← Pages (Login,  Dashboard)
    │   ├── components/   ← Reusable UI components
    │   └── router/       ← Page routing
    └── vite.config.js
```
