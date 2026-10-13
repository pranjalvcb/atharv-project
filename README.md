# CareCompanion — MCA Final Year Project

CareCompanion is a web platform that helps a family member hire a local non-clinical companion when they cannot personally accompany a parent/family member to a hospital.

## Core idea
A customer selects a companion, creates a support request, shares hospital/appointment details, receives status updates, and can follow the request until completion.

**Important scope:** The companion is not a doctor and does not diagnose, prescribe, consent for treatment, or provide medical advice. The platform is for companionship, coordination, communication, paperwork assistance and family updates.

## Technology
- Node.js + Express.js
- SQLite + better-sqlite3
- JWT authentication
- bcrypt password hashing
- HTML, CSS, JavaScript frontend
- REST API architecture

## Run locally
1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:5000`.

The database is automatically created and seeded on first run.

## Demo accounts
- Customer: `customer@care.local` / `demo123`
- Companion: `amit@care.local` / `demo123`
- Companion: `neha@care.local` / `demo123`
- Companion: `rahul@care.local` / `demo123`
- Admin: `admin@care.local` / `demo123`

## Main workflow
1. Customer registers/logs in.
2. Customer browses available companions.
3. Customer creates a booking with patient, hospital, city, date, time and support type.
4. Server calculates an estimated amount from the companion's hourly rate.
5. Companion sees the request and can accept/start/complete it.
6. Both sides can post booking updates.
7. Customer tracks the complete request history.

## Database tables
- `users` — authentication and roles.
- `companions` — companion profile, rate, rating, verification and availability.
- `bookings` — service requests and status lifecycle.
- `updates` — timestamped communication attached to a booking.

## API overview
- `POST /api/register`
- `POST /api/login`
- `GET /api/me`
- `GET /api/companions`
- `POST /api/bookings`
- `GET /api/bookings`
- `PATCH /api/bookings/:id/status`
- `GET /api/bookings/:id/updates`
- `POST /api/bookings/:id/updates`
- `GET /api/admin/stats`

## Production improvements
For a real commercial release, add identity/KYC verification, emergency contacts, consent flows, background verification, secure payments, notifications, audit logs, encryption at rest, rate limiting, stronger secrets, privacy/terms documents, support escalation, and clear medical/non-medical boundaries.
