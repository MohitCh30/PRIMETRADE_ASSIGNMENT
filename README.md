# PrimeTrade Assignment — Full-Stack REST API with React Frontend

A backend developer internship assignment implementing a scalable REST API with JWT authentication, role-based access control, and a React frontend to demonstrate and test the API.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Backend Setup](#4-backend-setup)
5. [Frontend Setup](#5-frontend-setup)
6. [Environment Variables](#6-environment-variables)
7. [API Endpoints](#7-api-endpoints)
8. [Authentication Flow](#8-authentication-flow)
9. [Security](#9-security)
10. [Scalability Notes](#10-scalability-notes)
11. [Future Improvements](#11-future-improvements)

---

## Live Hosting: - 

- **Frontend:** https://primetrade-assignment-three.vercel.app
- **Swagger Docs:** https://zealous-batsheva-mohitio-ed4d9d57.koyeb.app/api-docs

## 1. Project Overview

This project is a full-stack task management application built as part of a backend developer internship assignment. The backend exposes a versioned REST API (`/api/v1`) built with **Node.js** and **Express**, backed by a **PostgreSQL** database. It features:

- User registration and login with **JWT authentication**
- **bcrypt** password hashing for secure credential storage
- **Role-based access control** (`user` / `admin`) enforced via middleware
- Full **CRUD operations** on a `tasks` resource
- **Swagger UI** for interactive API documentation
- A lightweight **React (Vite)** frontend to exercise all API endpoints
- **Server-side object-level authorization** — task operations are scoped to the authenticated user's identity, preventing cross-user task access and modification
- **Safe API serialization** — authentication responses expose only intended user fields and never return password hashes
- **Authentication rate limiting** — login and registration endpoints are protected against excessive repeated requests

---

## 2. Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | HTTP server and routing |
| PostgreSQL | Relational database |
| `pg` (node-postgres) | PostgreSQL client / connection pool |
| JSON Web Tokens (JWT) | Stateless authentication |
| bcrypt | Password hashing |
| swagger-jsdoc + swagger-ui-express | Interactive API documentation |
| dotenv | Environment variable management |
| nodemon | Hot-reload during development |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite | Build tool and dev server |
| React Router DOM 7 | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| Bootstrap 5 | Styling and layout |

---

## 3. Project Structure

```text
PRIMETRADE_ASSIGNMENT/
├── backend/
│   ├── src/
│   │   ├── server.js               # Entry point — starts HTTP server on PORT
│   │   ├── app.js                  # Express app: CORS, routes, Swagger mount
│   │   ├── config/
│   │   │   └── db.js               # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── docs/
│   │   │   └── swagger.js          # Swagger/OpenAPI 3.0 setup
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT verification
│   │   │   ├── roleMiddleware.js   # Role-based access control
│   │   │   ├── rateLimitMiddleware.js # Authentication rate limiting
│   │   │   └── errorMiddleware.js  # Centralized error handling
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   └── taskModel.js
│   │   ├── routes/
│   │   │   ├── v1/
│   │   │   │   └── index.js        # Aggregates all v1 routes
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── healthRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── taskService.js
│   │   ├── utils/
│   │   │   ├── jwt.js              # Token generation helper
│   │   │   └── serializers.js      # Safe API response serializers
│   │   └── validators/
│   │       ├── authValidator.js
│   │       └── taskValidator.js
│   ├── tests/
│   │   ├── app.test.js             # Authentication, authorization & task tests
│   │   ├── helpers.js              # Test utilities
│   │   ├── ratelimit.test.js       # Authentication rate-limit tests
│   │   └── setup.js                # Test environment setup
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── api/
    │   │   └── api.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── components/
    │   │   ├── TaskForm.jsx
    │   │   └── TaskList.jsx
    │   └── services/
    │       ├── authService.js
    │       └── taskService.js
    └── package.json
    ```

## 4. Backend Setup

### Prerequisites
- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14

### Database Initialisation

Connect to your PostgreSQL instance and create the required database and tables:

```sql
CREATE DATABASE primetrade;

\c primetrade

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Install Dependencies & Run

```bash
cd backend
npm install

# Development (with hot-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.  
Swagger documentation: `http://localhost:5000/api-docs`

---

## 5. Frontend Setup

### Prerequisites
- **Node.js** ≥ 18

### Install Dependencies & Run

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server starts at `http://localhost:5173` and proxies API calls to `http://localhost:5000/api/v1`.

> **Note:** Ensure the backend is running before using the frontend.

---

## 6. Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Server
PORT=5000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=primetrade

# JWT
JWT_SECRET=your_super_secret_key_here

# CORS
CORS_ORIGINS=http://localhost:5173,https://primetrade-assignment-three.vercel.app

# Authentication rate limiting
LOGIN_RATE_LIMIT_MAX=5
REGISTER_RATE_LIMIT_MAX=10
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the Express server listens on |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `password` | Database password |
| `DB_NAME` | `primetrade` | Database name |
| `JWT_SECRET` | `supersecret` | Secret key for signing JWTs — **change in production** |
| `CORS_ORIGINS` | frontend origin(s) | Comma-separated list of allowed frontend origins |
| `LOGIN_RATE_LIMIT_MAX` | `5` | Maximum login attempts allowed per IP within the configured window |
| `REGISTER_RATE_LIMIT_MAX` | `10` | Maximum registration attempts allowed per IP within the configured window |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 7. API Endpoints

All endpoints are prefixed with `/api/v1`.

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ | Returns `{ "status": "OK" }` |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Register a new user |
| `POST` | `/auth/login` | ❌ | Login and receive a JWT |

**Register** — `POST /api/v1/auth/register`

```json
// Request body
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}

// Response 201
{
  "user": { "id": 1, "name": "Jane Doe", "email": "jane@example.com", "role": "user" },
  "token": "<JWT>"
}
```

**Login** — `POST /api/v1/auth/login`

```json
// Request body
{
  "email": "jane@example.com",
  "password": "secret123"
}

// Response 200
{
  "user": { "id": 1, "name": "Jane Doe", "email": "jane@example.com", "role": "user" },
  "token": "<JWT>"
}
```

### Tasks (protected — requires `Authorization: Bearer <token>`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/tasks` | ✅ | Fetch all tasks belonging to the authenticated user |
| `GET` | `/tasks/:id` | ✅ | Fetch a specific task belonging to the authenticated user |
| `POST` | `/tasks` | ✅ | Create a new task for the authenticated user |
| `PUT` | `/tasks/:id` | ✅ | Update a task belonging to the authenticated user |
| `DELETE` | `/tasks/:id` | ✅ | Delete a task belonging to the authenticated user |

**Create Task** — `POST /api/v1/tasks`

```json
// Request body
{
  "title": "Set up CI pipeline",
  "description": "Configure GitHub Actions for automated testing"
}

// Response 201
{
  "id": 5,
  "title": "Set up CI pipeline",
  "description": "Configure GitHub Actions for automated testing",
  "user_id": 1
}
```

**Update Task** — `PUT /api/v1/tasks/:id`

```json
// Request body
{
  "title": "Updated title",
  "description": "Updated description"
}
```

> Interactive documentation for all endpoints is available at `http://localhost:5000/api-docs` (Swagger UI).

---

## 8. Authentication Flow

```
Client                         Server
  |                               |
  |-- POST /auth/register ------> |  Validate input
  |                               |  Hash password (bcrypt, 10 rounds)
  |                               |  Insert user into DB
  |<-- 201 { user, token } ------ |  Sign JWT (1-day expiry)
  |                               |
  |-- POST /auth/login ---------->|  Look up user by email
  |                               |  Compare password with bcrypt
  |<-- 200 { user, token } ------ |  Sign JWT on success
  |                               |
  |-- GET /tasks ---------------> |  authMiddleware: verify JWT
  |   Authorization: Bearer <JWT> |  Use authenticated user identity
  |                               |  Scope query to authenticated user
  |<-- 200 [ ...tasks ] --------- |  Return tasks scoped to authenticated user
```

1. **Registration:** The client submits name, email, and password. The server validates the input, normalizes the email, hashes the password with bcrypt (10 salt rounds), stores the user record, and returns a signed JWT alongside a safe user representation.

2. **Login:** The client submits email and password. The server normalizes the email, fetches the user record, verifies the password with bcrypt, and returns a signed JWT alongside a safe user representation.

3. **Protected requests:** The client attaches the JWT as a `Bearer` token in the `Authorization` header. The `authMiddleware` verifies the signature and expiry before allowing access to protected routes.

4. **Object-level authorization:** Task operations use the authenticated user's server-side identity when querying, updating, or deleting tasks. Client-supplied ownership fields are not trusted, preventing users from accessing or modifying another user's tasks.

5. **Role-based access:** The `roleMiddleware` inspects the `role` field in the decoded JWT payload. Routes restricted to `admin` return `403 Forbidden` for regular users.

---

## 9. Security

The API separates authentication from authorization:

- **JWT authentication** verifies the identity of the caller before protected routes are accessed.
- **Object-level authorization** ensures task operations are scoped to the authenticated user's identity.
- Task ownership is enforced server-side in database queries rather than relying on frontend state or client-supplied `user_id` values.
- Authentication responses use explicit safe serializers and never expose password hashes.
- Login and registration endpoints use IP-based rate limiting.
- CORS is restricted to configured trusted origins.
- Client-supplied role and ownership fields are not accepted when creating or modifying resources.

Security-sensitive behavior is covered by automated Jest + Supertest regression tests, including cross-user task isolation, JWT validation, mass-assignment attempts, authentication rate limiting, CORS behavior, and sensitive-response checks.
--- 

## 10. Scalability Notes

| Concern | Current Approach | Scalability Path |
|---|---|---|
| **Connection management** | Single `pg.Pool` shared across the app | Increase pool size; use PgBouncer for connection pooling at scale |
| **Stateless auth** | JWT — no server-side session state | Horizontally scalable out of the box; add token revocation list (Redis) if needed |
| **API versioning** | `/api/v1` prefix via dedicated router | Add `/api/v2` router alongside v1 without breaking existing clients |
| **Layered architecture** | Controller → Service → Model | Each layer can be extracted into microservices independently |
| **Input validation** | Centralized validator middleware | Extend with `express-validator` or `zod` for richer schema validation |
| **Error handling** | Centralized `errorMiddleware` | Add structured logging (e.g., Winston + ELK stack) for observability |
| **Database** | PostgreSQL with indexed primary keys | Read replicas, partitioning, or caching layer (Redis) for high-read workloads |

---

## 11. Future Improvements

- [ ] **Refresh tokens** — issue short-lived access tokens with long-lived refresh tokens to reduce exposure
- [ ] **Email verification** — confirm user email addresses before activating accounts
- [ ] **Pagination & filtering** — add `limit`, `offset`, and search query parameters to `GET /tasks`
- [ ] **Task status & priority** — extend the task schema with `status` (todo / in-progress / done) and `priority` fields
- [ ] **Admin dashboard endpoints** — expose routes restricted to `admin` role for user management
- [x] **Rate limiting** — protect public authentication endpoints from excessive repeated requests using `express-rate-limit`
- [x] **Unit & integration tests** — Jest + Supertest regression coverage for authentication, authorization, task isolation, CORS, mass assignment, and rate limiting
- [ ] **Database-level email normalization constraint** — enforce case-insensitive uniqueness for user email addresses at the PostgreSQL level
- [ ] **Docker Compose** — containerise the backend and PostgreSQL for reproducible local and CI environments
- [ ] **CI/CD pipeline** — GitHub Actions workflow for lint, test, and deployment on every push
- [ ] **HTTPS & security headers** — enforce HTTPS in production and add `helmet` for HTTP security headers
