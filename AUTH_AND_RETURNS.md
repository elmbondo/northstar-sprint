# Northstar Features: Authentication & Returns

This document outlines the technical implementation and business logic behind the core features added to the Northstar support MVP: Session-Based Authentication and Dynamic Returns/Refunds.

## 1. Authentication (Sign In & Sign Up)

We intentionally built the authentication system without using JSON Web Tokens (JWTs). Instead, we use a robust **Server-Side Session** architecture.

### How it works:
- **Dependencies:** Uses `express-session` for managing the session lifecycle and `connect-mongo` to securely store the session data in the MongoDB database.
- **Sign Up (`/api/auth/signup`):** 
  - Validates that the email doesn't already exist.
  - Hashes the password using `bcryptjs`.
  - Saves the new user to the `users` collection.
  - Immediately logs the user in by creating a session cookie.
- **Sign In (`/api/auth/signin`):**
  - Verifies the user's email and password hash.
  - If successful, attaches the `userId` to the `req.session` object.
  - Express automatically sends a secure `connect.sid` HTTP-only cookie to the browser.
- **Session Persistence (`/api/auth/me`):**
  - When the React frontend loads, `App.jsx` automatically sends a request to `/api/auth/me` (with `credentials: 'include'`).
  - The backend verifies the session cookie, looks up the `userId` in the session store, and returns the user's data (name and email) to populate the frontend state.
- **Security:**
  - Cookies are configured with `httpOnly: true` (preventing XSS attacks) and `sameSite: 'lax'` (protecting against CSRF).

---

## 2. Returns & Refunds

The Returns & Refunds feature is designed as a smart, context-aware self-service tool for customers.

### How it works:
- **Logged-In Users (Frictionless Experience):**
  - If the user is currently signed in, the `Returns.jsx` frontend detects their `user` state.
  - It automatically sends a request to `/api/returns` using the user's session cookie.
  - The backend reads the session, grabs the verified email address, and searches the `returns` collection for any matching refunds or returns. 
  - The user sees their data immediately without needing to type anything.

- **Guest Users (Manual Lookup):**
  - If the user is *not* logged in (401), the interface displays an email lookup form.
  - The user manually types their email address.
  - The backend queries the `returns` collection based solely on the provided email.

- **Offline/Testing Fallback:**
  - To support UI testing even when the database is empty (or if a newly created test account has no real returns), the backend has a dynamic fallback mechanism.
  - If `returnsData.length === 0`, the backend automatically generates a dummy "Sample Support Order" return. This ensures developers and testers always see a fully functional UI instead of a blank "No returns found" screen.

## 3. Database Interactions
- **Support Logs:** Every time a user interacts with the Auth or Returns endpoints, a background process asynchronously writes a record to the `support_logs` collection. This allows Northstar customer service agents to see exactly what customers are doing in the portal (e.g., "Lookup by: eleanor@example.com").
- **Seeding:** The `scripts/seed-mongo.js` file is configured to drop test users and returns data into the database to quickly spin up testing environments.
