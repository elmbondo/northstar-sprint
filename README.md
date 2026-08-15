# Northstar Support Deflection MVP

## Overview

The Northstar Support Deflection MVP is a customer-facing self-service support application designed to reduce repetitive customer support tickets for the Northstar Retail Co. support team.

Customers frequently contact support for two primary reasons: checking their **Order Status** and initiating **Returns or Refunds**. This MVP addresses the client problem by allowing customers to securely access their order and return information without needing to immediately escalate to a human agent.

The MVP supports a fully authenticated customer experience as well as a frictionless guest access flow.

## Team Members and Roles

Based on the original Northstar Sprint assignment sheet and ongoing responsibilities:

| Member | Role | Main Responsibilities |
|---|---|---|
| **Fidelmah** | Technical Lead / Repository | Repository setup, order mock data/status logic, integration, audit |
| **Eugene** | Frontend/UI | Wireframe/user flow, homepage, Order Status UI, Monorepo restructure |
| **Lilian** | Deployment/Cloud | Local environment, Vercel deployment |
| **Surafel** | Returns & Auth Features | Returns/Refunds interface, response logic, Sign In, Sign Up features |
| **Akinyi** | QA/Documentation | Requirements, customer journeys, QA/documentation, audit, final delivery |

### Team Charter
- **Communication:** Primary communication is handled via WhatsApp with daily check-ins as agreed upon by the team.
- **Deadlines:** Tasks are actively tracked on the project board. Blockers are communicated promptly.
- **Conflict Resolution:** Disagreements are discussed in the group. Unresolved issues are escalated to the team lead.
- **Escalation:** Inactivity or significant blockers are escalated to the team lead and instructor when necessary.

---

## Customer Journeys

### 1. Authentication Journey
- **Sign Up:** Customers can register an account securely. Passwords are hashed, and duplicate emails are rejected.
- **Sign In:** Authenticated via highly secure, persistent, server-side HTTP-only session cookies.
- **Sign Out:** Secure destruction of active sessions.

### 2. Order Status
1. Customer navigates to the Order Status page.
2. Customer enters their Order Number (e.g., `NS1001`).
3. Frontend validates the input and calls the backend API.
4. Backend securely looks up the order in the database.
5. The UI dynamically renders the order's status, expected delivery date, and product details.

### 3. Returns & Refunds
1. Customer navigates to Returns & Refunds.
2. **Authenticated Flow:** If logged in, the system automatically pulls their email from the secure session and fetches their active returns flawlessly with zero friction.
3. **Guest Flow:** If logged out, the user is prompted to enter an email address. The system retrieves associated returns based on the email provided. *(Note: You can test this using the seeded demo email `eleanor@example.com` or `julian@example.com`)*
4. Frontend displays real-time return/refund statuses (e.g., "Refund Processed", "In Transit").

---

## Features

### Customer Support
- **Support Homepage:** Centralized hub for customer needs.
- **Order Status Lookup:** Real-time visibility into mock orders (Test with: `NS1001`).
- **Returns & Refunds Hub:** Self-service tracking of return requests (Test with: `eleanor@example.com`).
- **Escalation:** Clear UI pathways to contact human support if self-service fails.

### Authentication
- Fully functional **Sign In** and **Sign Up** forms.
- Server-side persistent session management.
- Real-time HTML5 form validation and backend error messaging.

---

## Technical Architecture

The application is built using a modern decoupled architecture inside a monorepo workspace.

- **Frontend:** React, Vite, Tailwind CSS.
- **Backend:** Express.js custom API server adapted for serverless deployment.
- **Database:** MongoDB Atlas (NoSQL).

```mermaid
flowchart TD
    A[Customer Browser] --> B[React/Vite Frontend]
    B -->|fetch() API Calls| C[Express Serverless API]
    C -->|Mongoose/Driver queries| D[(MongoDB Atlas)]
    D --> C
    C --> B
    B --> A
```

## Project Structure

```text
northstar-sprint/
├── api/                  # Vercel Serverless Function entry point (exports Express app)
├── backend/              # Backend workspace
│   ├── api/              # API Route Handlers (auth.js, returns.js, orders.js, logs.js)
│   ├── lib/              # MongoDB connection client
│   ├── scripts/          # Database seeding scripts
│   └── server.js         # Core Express application and session middleware
├── docs/                 # Documentation (QA reports, etc.)
├── frontend/             # Frontend workspace
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   └── pages/        # Route views (SignIn, Returns, OrderStatus, etc.)
│   ├── index.html        # Vite entry HTML
│   ├── tailwind.config.js
│   └── vite.config.js    # Vite configuration & API proxy
├── pnpm-workspace.yaml   # Monorepo workspace config
├── vercel.json           # Vercel deployment rewrites
└── package.json          # Root scripts
```

---

## API Documentation

The backend utilizes standard RESTful conventions. Responses follow a strict shape: `{ "success": boolean, "message"?: string, ...data }`.

### Authentication
- `POST /api/auth/signup` - Registers a new user. Expects `{ name, email, password }`.
- `POST /api/auth/signin` - Authenticates a user and creates a session cookie. Expects `{ email, password }`.
- `POST /api/auth/signout` - Destroys the active session.
- `GET /api/auth/me` - Returns active session user data or a 401 if unauthenticated.

### Core Features
- `GET /api/orders/:orderNumber` - Retrieves order information for a specific order.
- `POST /api/returns` - Retrieves return/refund data. If authenticated, uses session email. Otherwise, expects `{ email }` in the request body.
- `GET/POST /api/logs` - Internal logging mechanism to track customer support portal usage.

---

## Database

The project strictly uses **MongoDB Atlas**.

- **Collections:** `orders`, `returns`, `users`, `sessions`, `support_logs`.
- **Sessions:** Handled natively by `connect-mongo` which writes session data directly to the database.
- **Seed Data:** The project includes a dedicated seed script to inject test data into the collections for testing purposes.

---

## Local Development Setup

### Prerequisites
- Node.js (v20+)
- `pnpm` package manager
- A MongoDB Atlas Cluster URL

### 1. Clone the repository
```bash
git clone https://github.com/elmbondo/northstar-sprint.git
cd northstar-sprint
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=a_secure_random_string
```

### 4. Seed the Database
```bash
pnpm --filter backend run db:seed
```

### 5. Run the Application
```bash
pnpm dev
```
- Frontend will run on `http://localhost:5173`
- Backend API runs concurrently on `http://localhost:3000`

---

## Deployment & Live Demo

The application is deployed live via **Vercel**. 

Since the project is live, anyone can test the full functionality using the **live Vercel link available on the right side of this GitHub repository** (under the "Deployments" or "Environments" section).

- The `frontend/` directory is built natively by Vercel using the Vite preset.
- The `backend/` Express server is wrapped by a serverless entry point at `api/index.js`.
- The `vercel.json` file automatically rewrites all `/api/*` traffic to the serverless function.

---

## Git Workflow

The team follows a standardized feature-branch workflow:
- `main` — Production-ready code.
- `dev` — Staging integration branch.
- Feature branches — Developed individually (e.g., `feat/returns-refunds`, `feat/eugene-homepage`) and merged into `dev` or directly to `main` depending on the sprint phase.

---

## QA and Testing

Extensive QA testing has been conducted to verify the stability of the application. 

The full test suite execution details, manual verification steps, and bug reports are documented in our official QA report.
👉 **[View QA Test Report](./docs/QA_TEST_REPORT.md)**

Testing covered:
- Valid/Invalid form submissions.
- HTTP status code adherence.
- Database edge cases (e.g., email with no records, unknown order numbers).
- Navigation and loading state UI/UX.

---

## Error Handling

- **Frontend:** Utilizes React state to render error boundaries, UI error messages, and loading spinners during asynchronous fetch calls. Native HTML5 validation (`required`, `type="email"`) is utilized heavily.
- **Backend:** All routes are wrapped in `try/catch` blocks. The API returns explicit JSON error messages alongside appropriate HTTP status codes (e.g., `401 Unauthorized`, `400 Bad Request`, `404 Not Found`).

---

## Security / Secrets

- All passwords are cryptographically hashed using `bcryptjs` before entering the database.
- Sessions are managed via secure, `httpOnly`, `sameSite: 'lax'` cookies to mitigate XSS and CSRF attacks. JWTs are intentionally avoided.
- Secrets (`MONGODB_URI`) are strictly managed via local `.env` files (ignored in version control) and injected securely via Vercel's Environment Settings in production. 

---

## MVP Scope and Limitations

- **Mock Commerce:** This is an MVP designed for support deflection. It does not integrate with a real, live commerce backend (like Shopify). Order and return data is statically seeded for demonstration purposes.
- **Payments:** This system cannot process real financial refunds.
- **Agent Dashboard:** While the app tracks support logs, there is no administrative dashboard built out for human agents to view these logs yet.

---

## Future Improvements

- **Real Commerce Integration:** Syncing the MongoDB database with real webhook events from a commerce platform.
- **AI Triage:** Integrating an AI chatbot to handle questions that are not related to orders or returns.
- **Agent Handoff:** A seamless live-chat escalation system if the self-service flow fails.
- **Knowledge Base Integration:** Surfacing relevant FAQs directly inside the support portal.

---

## Assignment Mapping

| Task ID | Task | Owner | Status |
|---|---|---|---|
| NS-01 | Create GitHub repository and project structure | Fidelmah | Complete |
| NS-02 | Define MVP requirements and customer journeys | Akinyi | Complete |
| NS-03 | Create application wireframe/user flow | Eugene | Complete |
| NS-04 | Configure local development environment | Lilian | Complete |
| NS-05 | Build Northstar homepage/interface | Eugene | Complete |
| NS-06 | Create mock order data and status logic | Fidelmah | Complete |
| NS-07 | Build Order Status feature | Eugene | Complete |
| NS-08 | Build Returns/Refunds interface | Surafel | Complete |
| NS-09 | Add Returns/Refunds response logic | Surafel | Complete |
| NS-10 | Integrate Order Status + Returns features | Fidelmah | Complete |
| NS-11 | Deploy MVP to Vercel | Lilian | Complete |
| NS-12 | Conduct functional and usability testing | Akinyi | Complete |
| NS-13 | Develop user documentation | Akinyi | Complete |
| NS-14 | Contribution/audit review | Fidelmah & Akinyi | Complete |
| NS-15 | Prepare final delivery package and go-live note | Akinyi | Complete |

---

## Demo Instructions (How to test the Live Project)

If you are opening the live Vercel link from GitHub, follow these steps to test the real database logic:

1. **Test Order Status:** Navigate to **Order Status**, enter the sample order number `NS1001`, and click submit to fetch live mock delivery data from MongoDB.
2. **Test Guest Returns:** Navigate to **Returns & Refunds**, enter the sample email `eleanor@example.com` into the lookup form, and submit it to pull her associated return data securely without an account.
3. **Test Authenticated Returns:** 
   - Navigate to **Sign Up** and create an account using `eleanor@example.com`.
   - Once logged in, click on the **Returns & Refunds** link. Notice how the system automatically recognizes your session and flawlessly fetches her data without asking for an email address! 
4. **Test Error Handling:** Try entering a random order number like `NS9999` or a random email like `test@test.com` to observe how the application handles empty states and errors natively.
