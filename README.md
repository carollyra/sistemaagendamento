# Fade Barbearia — Scheduling System

Full stack appointment scheduling system for a barbershop.
The interface and the API messages are in Brazilian Portuguese; the codebase
(identifiers, routes, database fields) stays in English.

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

### Database scripts (backend)

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run db:generate`  | Generate the Prisma Client                    |
| `npm run db:migrate`   | Create and apply a migration (development)    |
| `npm run db:deploy`    | Apply pending migrations (production)         |
| `npm run db:seed`      | Seed an admin user and the default services (Corte, Barba, Corte + Barba, Corte infantil) |
| `npm run db:studio`    | Open Prisma Studio                            |

## Data model

- **User** — `id`, `name`, `email` (unique), `phone`, `passwordHash`, `role` (`CLIENT` | `ADMIN`)
- **Service** — `id`, `name` (unique), `description`, `durationMinutes`, `price`, `active`
- **Appointment** — `id`, `userId`, `serviceId`, `startsAt`, `endsAt`,
  `status` (`SCHEDULED` | `COMPLETED` | `CANCELLED`), `notes`

`endsAt` is derived from the service duration and is used to detect slot conflicts.

## Environment variables

Real values live in `.env` files, which are never committed. See `backend/.env.example`
and `frontend/.env.example` for the expected keys.

## API

| Method | Route            | Auth   | Description                          |
| ------ | ---------------- | ------ | ------------------------------------ |
| GET    | `/health`        | –      | Service health check                 |
| POST   | `/auth/register` | –      | Create a client account, returns JWT |
| POST   | `/auth/login`    | –      | Log in, returns JWT                  |
| GET    | `/auth/me`       | Bearer | Current user profile                 |

| GET    | `/services`                     | –      | List services (`?includeInactive=true` for admins) |
| GET    | `/services/:id`                 | –      | Service details                                    |
| POST   | `/services`                     | Admin  | Create a service                                   |
| PATCH  | `/services/:id`                 | Admin  | Update a service                                   |
| DELETE | `/services/:id`                 | Admin  | Delete, or deactivate if it has appointments       |
| GET    | `/appointments/availability`    | –      | Free slots for `?serviceId=&date=YYYY-MM-DD`       |
| POST   | `/appointments`                 | Bearer | Book a slot                                        |
| GET    | `/appointments/me`              | Bearer | Appointments of the logged in user                 |
| PATCH  | `/appointments/:id/cancel`      | Bearer | Cancel (owner or admin)                            |
| GET    | `/appointments/agenda`          | Admin  | Day agenda (`?date=`, defaults to today)           |
| PATCH  | `/appointments/:id/status`      | Admin  | Change status                                      |

Protected routes expect the header `Authorization: Bearer <token>`.

## Booking rules

- Appointments must start in the future and fit inside the business hours
  (`BUSINESS_*` variables, default Mon–Sat 09:00–19:00, `America/Sao_Paulo`).
- `endsAt` is derived from the service duration.
- A slot is rejected with `409` when it overlaps another `SCHEDULED` appointment;
  the check runs inside a serializable transaction.
- Cancelled appointments release the slot again.

## Design system

The frontend ships with a small, self-contained design system in
`frontend/src/index.css`:

- **Palette** — deep blue-tinted neutrals (`ink-*`), muted text greys (`mist-*`)
  and a single accent, a refined gold (`gold-*`).
- **Typography** — SF Pro when the device has it, Inter Tight as the web
  fallback. Rigid scale (`text-eyebrow` → `text-hero`) with negative tracking on
  the large sizes and weight contrast inside headlines (`.text-light`).
- **Surfaces** — `.glass` (blur 40px + saturate 180%, 1px white border and a
  gradient light line on the top edge) for chrome and panels, `.surface` as its
  solid sibling for long lists, `.field` for inputs.
- **Motion** — `animate-fade-up`, `animate-fade-in`, `animate-scale-in` and a
  shimmer used by the skeleton loaders.
- **Photography** — curated Unsplash images served straight from the CDN
  (`frontend/src/lib/images.ts`, no API key): dark, high contrast, detail driven
  (chair, clippers, razor, tools) with no faces in the foreground. Every `<img>`
  carries the `.photo` class (one brightness/contrast/saturation treatment) and
  every overlay uses the same bottom-up `.photo-scrim` gradient.
- **Dense pickers** — `DateStrip` (scrollable day selector) and `TimePills`
  (scrollable time slots), both with a filled state in the accent colour.

## UI toolkit

- **shadcn/ui** components live in `frontend/src/components/ui` (`components.json`
  is configured, so `npx shadcn@latest add <component>` works). They were adapted
  to the palette above instead of bringing their own theme: Dialog, Badge,
  Skeleton, Input/Textarea, Label, Select and the Sonner toaster.
- **Radix UI** powers the accessible primitives behind those components.
- **framer-motion** handles the step transitions, list stagger (50 ms apart),
  `layoutId` pills on the date/time pickers and admin tabs, and a 1.02 hover
  scale on cards. Everything runs on one spring (stiffness 300, damping 30,
  mass 0.8 — `src/lib/motion.ts`). `MotionConfig reducedMotion="user"` plus a
  `prefers-reduced-motion` block in the CSS disable movement for users who ask
  for it.
- **lucide-react** provides the icon set.
- **sonner** shows the result of actions (booking, cancelling, service changes);
  inline alerts are reserved for load failures and empty states.

## Frontend routes

| Route           | Access | Description                                      |
| --------------- | ------ | ------------------------------------------------ |
| `/`             | Public | Landing page                                     |
| `/login`        | Public | Sign in                                          |
| `/register`     | Public | Create a client account                          |
| `/book`         | Client | Booking flow: service → date → time              |
| `/appointments` | Client | Upcoming bookings and history, with cancelling   |
| `/admin`        | Admin  | Day agenda and service management                |

## Roadmap

- [x] 1. Project setup (TypeScript, ESLint/Prettier, env files)
- [x] 2. Database modeling with Prisma (User, Service, Appointment)
- [x] 3. Auth: sign up and login with JWT + bcrypt
- [x] 4. Services CRUD (admin) and appointments with slot conflict rules
- [x] 5. Sign up and login screens
- [x] 6. Booking flow (service → date → available time)
- [x] 7. "My appointments" page with cancel
- [x] 8. Admin panel: manage services and view the day's agenda
- [x] 9. Visual redesign: design system, typography and polished UI
- [x] 10. shadcn/ui primitives, toasts and motion
- [x] 11. Brazilian Portuguese interface and "Fade Barbearia" branding
- [x] 12. Premium visual pass: photography, denser pickers, new type pairing
- [x] 13. Deep refinement: glass material, spring motion, rigid type scale
