QuickShow – Movie Ticket Booking (WIP)

🚧 Status: Work In Progress. Core flows are being built and refined.

A full-stack movie booking app where users can sign up, explore movies, pick seats, and book tickets. It includes an Admin Dashboard to add new movies and manage bookings.
Authentication is powered by Clerk (Email / Social / Phone, multi-session switching), and background jobs & scheduling are handled by Inngest (emails on new movies, booking confirmation, and showtime reminders).
When a payment fails/cancels, seats are reserved for 10 minutes to let the user retry; if payment isn’t completed within 10 minutes, the seats are automatically released.

✨ Features

Auth (Clerk): Email, Social, Phone + multi-session profiles & quick switching.

Browse & Search Movies: Posters, details, genres, runtime, release year.

Seat Selection & Booking: Seat map with hold logic.

Payments: Retries supported; seat hold on fail/cancel (10 min).

Emails (Inngest):

Notify all users when a new movie is added.

Booking confirmation email.

Reminder email a few hours before showtime.

Admin Dashboard:

Add/edit movies.

Manage bookings and showtimes.

🧰 Tech Stack

Framework: Next.js (TypeScript)

Styling: Tailwind CSS

Auth: Clerk

Jobs & Scheduling: Inngest

Database: (e.g., PostgreSQL with Prisma) ← adjust if different

Payments: (e.g., Stripe) ← adjust/replace if different

Email: Your provider or Inngest integration (adjust as needed)

Replace the DB/Payments/Email providers above with what you actually use.

🗂️ Project Structure (suggested)
.
├─ app/                     # Next.js routes (app router)
│  ├─ (public)/             # public-facing pages
│  ├─ admin/                # admin dashboard
│  └─ api/                  # API routes (booking, webhooks, etc.)
├─ components/              # UI components
├─ lib/                     # helpers (db, clerk, utils)
├─ inngest/                 # Inngest functions (emails, releases, schedules)
├─ prisma/                  # Prisma schema & migrations (if using Prisma)
├─ public/                  # static assets
├─ .env.example             # example environment variables
└─ README.md

🚀 Getting Started
Prerequisites

Node.js 18+

pnpm / yarn / npm

Database (e.g., PostgreSQL) if applicable

Clerk project (Frontend & Backend keys)

Inngest account & app keys

(Optional) Payment provider keys (e.g., Stripe)

1) Clone & Install
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
pnpm install   # or yarn / npm install

2) Environment Variables

Create .env.local (Next.js) and add what you use. Example:

# --- Clerk ---
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_************
CLERK_SECRET_KEY=sk_test_************

# --- Database (example: Prisma + Postgres) ---
DATABASE_URL=postgresql://user:password@host:5432/quickshow

# --- Inngest ---
INNGEST_EVENT_KEY=ie_************
INNGEST_SIGNING_KEY=isk_************

# --- Email (if separate) ---
EMAIL_FROM=noreply@yourdomain.com
EMAIL_SERVER=smtp.yourprovider.com
EMAIL_USER=************
EMAIL_PASS=************

# --- Payments (if using Stripe or similar) ---
STRIPE_SECRET_KEY=sk_test_************
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_************
STRIPE_WEBHOOK_SECRET=whsec_************


Tip: Add a committed .env.example with placeholders so contributors know what’s needed.

3) (Optional) Database Setup

If you use Prisma:

pnpm prisma migrate dev
pnpm prisma generate
# pnpm prisma db seed   (if you have seeds)

4) Run Dev
# Next.js
pnpm dev

# Inngest (separate terminal)
pnpm inngest dev   # or `npx inngest-cli dev`


Open:

App: http://localhost:3000

Inngest Dev UI: (CLI shows the local URL)

🧠 How It Works
Authentication (Clerk)

Users can sign up via Email / Social / Phone.

Multi-session enabled: users can create multiple profiles and switch without logging out.

Booking Flow & Seat Hold

User selects seats → provisional hold created (DB flag + TTL).

User proceeds to payment provider.

On success: booking is confirmed; email is sent.

On cancel/failure: hold remains for 10 minutes so the user can retry.

Inngest job releases seats automatically after 10 minutes if payment isn’t completed.

Background Jobs (Inngest)

onMovieCreated: Send “new movie” email to all users.

onBookingConfirmed: Send booking confirmation.

showtimeReminder: Scheduled reminder a few hours before showtime.

releaseSeats: Runs when a hold expires to free seats.

Implemented as Inngest functions listening to internal events (e.g., movie.created, booking.confirmed, booking.hold.expired).

Admin Dashboard

Add/edit movies (title, overview, genres, runtime, release date, poster/backdrop).

Manage showtimes & bookings.

🔌 Scripts (examples)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "format": "prettier --write .",
    "lint": "next lint",
    "inngest:dev": "inngest dev",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "prisma db seed"
  }
}


Adjust to match your package manager and tooling.

✅ Roadmap

 Finish seat map UI & accessibility

 Finalize payment webhooks + error handling

 Admin analytics (daily bookings, revenue, occupancy)

 Movie search & filters (genre, language, release year)

 E2E tests (Playwright) & integration tests

 Production observability (logs, tracing, metrics)

📷 Screenshots

Add images in /public and link them here.

Home
![Home](./public/screens/home.png)

Movie Details
![Details](./public/screens/details.png)

Seat Selection
![Seats](./public/screens/seats.png)

Admin Dashboard
![Admin](./public/screens/admin.png)

🤝 Contributing

PRs are welcome! Please:

Create a feature branch.

Write clear commit messages.

Add tests where relevant.

📄 License

MIT — feel free to use and modify. See LICENSE for details.

📫 Contact

Your Name – nefsiabdelouahab@gmail.com

Twitter / LinkedIn:

Notes for Reviewers

This project uses Clerk for multi-session auth and Inngest for background jobs. If you’re testing bookings, use test cards from your payment provider. For local emails, point to a dev SMTP or console transport.
