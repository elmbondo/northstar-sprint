# Northstar Support MVP Setup Guide

This guide explains how the project database works and how the setup instructions in this markdown file are meant to be used by the group.

## 1) What the database is doing

This project uses Prisma with SQLite for local development.

- Prisma config lives in `prisma/schema.prisma`
- The database connection string is loaded from `DATABASE_URL`
- The app uses SQLite as a simple local database file, not a separate server

The database schema includes:

- `Order` - stores order details such as order number, customer name, product, status, and dates
- `SupportLog` - stores support interaction events and metadata
- `ReturnResponse` - stores FAQ-style return answers for the returns flow

### Important file references

- `prisma/schema.prisma` defines the database models
- `prisma/seed.js` loads starter data into the database
- `api/orders.js` reads order information from the database when `DATABASE_URL` is present
- `api/logs.js` writes support logs to the database
- `api/returns.js` looks up return guidance from the database

If `DATABASE_URL` is not configured, the API routes will fall back to in-memory mock data instead of the real database.

---

## 2) How the markdown file works

This `.md` file is a setup guide for people, not a runtime file for the app.

It does not connect to the database by itself.

Instead, it explains:

- what software is required
- what environment variables are needed
- what commands to run
- what files are involved
- what the database is expected to contain

So the markdown file is basically a project instruction document that helps the team set up the app correctly.

---

## 3) Required setup for the group

### Prerequisites

Make sure these are installed on your machine:

- Node.js (18 or newer recommended)
- npm
- Git

### 1. Open the project folder

```bash
cd /home/sinux/Projects/PLP/northstar-sprint
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

There is already a `.env.example` file in the project. Create a local file from it:

```bash
cp .env.example .env.local
```

If you are on Windows PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

### 4. Confirm the database URL

Your `.env.local` file should contain:

```env
DATABASE_URL="file:../dev.db"
```

This tells Prisma to use a local SQLite database file named `dev.db` in the project folder.

### 5. Push the Prisma schema to the database

```bash
npx prisma db push
```

This creates the SQLite database and tables based on the schema in `prisma/schema.prisma`.

### 6. Seed the sample data

```bash
npm run prisma:seed
```

This inserts starter order data and return FAQ entries so the app has working sample content.

### 7. Start the app

```bash
npm run dev
```

This starts the Vite frontend and the local development workflow.

If you want to run the API server separately, use:

```bash
npm run dev:api
```

---

## 4) How the app uses the database at runtime

The runtime flow looks like this:

1. The frontend sends requests to the backend routes in the `api/` folder.
2. The route handler checks whether `DATABASE_URL` is set.
3. If the database is available, Prisma queries the SQLite database.
4. If it is not available, the code falls back to mock in-memory data.

Examples:

- `api/orders.js` looks up an order by order number
- `api/logs.js` writes support interaction logs
- `api/returns.js` retrieves a return answer by question ID

This means the app works with real data when the database is configured correctly, and still has a fallback for local testing when it is not.

---

## 5) Database setup summary

Use this as the short version for the group:

```bash
npm install
cp .env.example .env.local
npx prisma db push
npm run prisma:seed
npm run dev
```

Make sure `.env.local` contains:

```env
DATABASE_URL="file:../dev.db"
```

---

## 6) Troubleshooting

### The app says the database is not set

Check that `.env.local` exists and contains `DATABASE_URL`.

### Prisma says the database table does not exist

Run:

```bash
npx prisma db push
```

### Seed data did not load

Run:

```bash
npm run prisma:seed
```

### The app still shows mock data

This usually means `DATABASE_URL` is missing or not loaded. Confirm the environment file is present and restart the dev server.

---

## 7) Final note

This markdown file is the onboarding document for the team. It explains the project setup and how the database connects to the app, but it is not the application itself. The real database logic lives in:

- `prisma/schema.prisma`
- `prisma/seed.js`
- `api/*.js`

If everyone follows the steps above, the group should be able to set up the project and run the SQLite-backed app locally without confusion.
