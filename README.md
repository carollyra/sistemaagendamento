# Barbershop Scheduling System

Full stack appointment scheduling system for a barbershop.

## Stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| Frontend | React + TypeScript, Vite, Tailwind CSS            |
| Backend  | Node.js + TypeScript, Express                     |
| Database | PostgreSQL (Neon) with Prisma ORM                 |
| Auth     | JWT + bcrypt                                      |

## Structure

```
.
├── backend/          # Express API
│   ├── prisma/       # Prisma schema and migrations
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       └── services/
├── frontend/         # React app
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── pages/
│       └── services/
└── README.md
```

## Requirements

- Node.js 20+
- A PostgreSQL database (Neon connection string)

## Getting started

### Backend

```bash
cd backend
cp .env.example .env    # fill in DATABASE_URL and JWT_SECRET
npm install
npm run dev             # http://localhost:3333
```

### Frontend

```bash
cd frontend
cp .env.example .env    # VITE_API_URL
npm install
npm run dev             # http://localhost:5173
```

## Scripts

Both projects share the same script names:

| Script                 | Description                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Start in development mode       |
| `npm run build`        | Production build                |
| `npm run lint`         | Run ESLint                      |
| `npm run format`       | Format with Prettier            |
| `npm run typecheck`    | TypeScript check without emit   |

Backend also has `npm start` to run the compiled output from `dist/`.

## Environment variables

Real values live in `.env` files, which are never committed. See `backend/.env.example`
and `frontend/.env.example` for the expected keys.

## Roadmap

- [x] 1. Project setup (TypeScript, ESLint/Prettier, env files)
- [ ] 2. Database modeling with Prisma (User, Service, Appointment)
- [ ] 3. Auth: sign up and login with JWT + bcrypt
- [ ] 4. Services CRUD (admin) and appointments with slot conflict rules
- [ ] 5. Sign up and login screens
- [ ] 6. Booking flow (service → date → available time)
- [ ] 7. "My appointments" page with cancel
- [ ] 8. Admin panel: manage services and view the day's agenda
