# Northstar Support MVP

This project uses React + Vite on the frontend and Prisma-backed serverless API routes in `api/`.

## Database

The repo is now configured for SQLite through Prisma.

Set `DATABASE_URL` to your SQLite database file in a local `.env` or `.env.local` file:

```bash
DATABASE_URL="file:../dev.db"
```

## Local setup

1. Copy `.env.example` to `.env.local`
2. Fill in `DATABASE_URL` with `file:../dev.db`
3. Run `npm install` if needed
4. Run `npx prisma db push` to create the local SQLite database
5. Run `npm run prisma:seed` to load the sample support data
6. Start the app with `npm run dev`

## Notes

- The project does not use a separate Express backend. Backend logic lives in `api/*.js`.
- `npm run dev:api` is available if you only want the local API server.
