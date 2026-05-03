# Dockerized Node.js Backend Portfolio Project

This repository is a backend portfolio/demo project built with Node.js, Express, and MongoDB.

It demonstrates:

- Session-based authentication and role-based admin authorization
- Course management and news management flows
- Server-rendered views with Handlebars
- Dockerized local development with a separate MongoDB container
- Automatic demo seeding for local showcase

Important scope note:

- This project is for learning and portfolio demonstration.
- It is not presented as production-ready infrastructure.

## Tech Stack

- Node.js (CommonJS)
- Express 5
- MongoDB + Mongoose
- express-session + connect-mongo
- Handlebars
- Docker + Docker Compose
- Jest + Supertest

## What This Project Shows

- Auth: register, login, logout, reset request flow
- Roles: `user` and `admin`
- Admin features: manage users and grant admin role
- Courses: create, edit, soft-delete/restore, force delete
- News: public list/detail + admin CRUD
- Security basics: Helmet, CSRF protection, login rate limit

## Containers Overview

This Docker Compose setup uses two containers:

| Container | Purpose | Notes |
| --- | --- | --- |
| `backend` | Runs the Node.js app | Built from local `Dockerfile`, exposed on port `3000`, image tag `bken824/my-backend-app:1.1` |
| `mongo` | Runs MongoDB database | Uses `mongo:7`, data persisted in Docker volume `mongo-data` |

Connection detail:

- The backend connects to MongoDB with Compose service DNS: `mongodb://mongo:27017/baokim_dev`.

## Quick Start (Docker)

1. Clone this repository.
2. Create a `.env` file in the project root (minimum: `SESSION_SECRET=your_secret`).
3. Build and run:

```bash
docker compose up --build
```

App URL:

- http://localhost:3000

Detached mode:

```bash
docker compose up -d
```

Stop services:

```bash
docker compose down
```

Stop services and remove database volume:

```bash
docker compose down -v
```

View backend logs:

```bash
docker compose logs backend
```

Open shell in backend container:

```bash
docker compose exec backend sh
```

## Data Initialization and Seed Notes

MongoDB behavior on first run:

- The MongoDB volume starts empty.
- Without seeding, there is no initial app data.

Current project behavior:

- This codebase includes automatic startup seeding in `src/config/db/seed.js`.
- Seeding is controlled by env flags (`AUTO_SEED`, `SEED_DEMO_CONTENT`, etc.).
- Seed logic is idempotent for the seeded records (no duplicate inserts on restart).

### Demo Admin Account (Local/Demo Only)

For local showcase only, default seed values are:

- Email: `admin@demo.local`
- Password: `Admin123`

Do not use this account pattern in real production systems.

## Seed Script Status

`package.json` currently does not include a dedicated seed npm script.

### TODO (recommended)

Add a script such as `npm run seed` that can be executed manually (inside or outside Docker) and ensure it:

- creates one demo admin user
- optionally inserts sample course/news data
- does not create duplicates when run multiple times

## Environment Variables

| Variable | Required | Default/Example | Purpose |
| --- | --- | --- | --- |
| `MONGO_URI` | Yes | `mongodb://mongo:27017/baokim_dev` | MongoDB connection string used by app |
| `SESSION_SECRET` | Yes | (set in `.env`) | Session signing secret |
| `PORT` | No | `3000` | App port inside container |
| `NODE_ENV` | No | `development` | Runtime mode |
| `AUTO_SEED` | No | `true` | Enable/disable startup seed |
| `SEED_DEMO_CONTENT` | No | `true` | Seed demo courses/news |
| `SEED_ADMIN_NAME` | No | `Demo Admin` | Seeded admin display name |
| `SEED_ADMIN_EMAIL` | No | `admin@demo.local` | Seeded admin login email |
| `SEED_ADMIN_PASSWORD` | No | `Admin123` | Seeded admin password |
| `SEED_ADMIN_RESET_PASSWORD` | No | `false` | Reset seeded admin password on startup |

## Build and Push Docker Image (Docker Hub)

Build image locally:

```bash
docker build -t bken824/my-backend-app:1.1 .
```

Login and push:

```bash
docker login
docker push bken824/my-backend-app:1.1
```

Optional latest tag:

```bash
docker tag bken824/my-backend-app:1.1 bken824/my-backend-app:latest
docker push bken824/my-backend-app:latest
```

## Local (Non-Docker) Commands

Install dependencies:

```bash
npm install
```

Run app:

```bash
npm run start
```

Run tests:

```bash
npm test
```

## Project Structure

```text
.
|- Dockerfile
|- docker-compose.yml
|- package.json
|- scripts/
|  |- grant-admin.js
|- src/
|  |- index.js
|  |- app/
|  |  |- controllers/
|  |  |  |- AdminUserController.js
|  |  |  |- AuthController.js
|  |  |  |- CourseController.js
|  |  |  |- MeController.js
|  |  |  |- NewsController.js
|  |  |  |- SiteController.js
|  |  |- models/
|  |     |- Course.js
|  |     |- News.js
|  |     |- User.js
|  |- config/
|  |  |- db/
|  |     |- index.js
|  |     |- seed.js
|  |- middleware/
|  |  |- auth.js
|  |  |- authorize.js
|  |  |- rateLimit.js
|  |- resources/
|  |  |- views/
|  |  |- public/
|  |- routes/
|  |  |- index.js
|  |  |- auth.js
|  |  |- courses.js
|  |  |- news.js
|  |  |- admin.js
|  |  |- me.js
|  |  |- site.js
|  |- util/
|     |- mongoose.js
|     |- validators.js
|- __tests__/
```

## Main Route Groups

- `/` and site pages
- `/login`, `/register`, `/logout`, `/reset`
- `/courses/*`
- `/news/*`
- `/me/*`
- `/admin/*`

## Current Limitations (Honest Portfolio Notes)

- No dedicated API docs (Swagger/OpenAPI) yet
- No CI pipeline configured yet
- No production deployment config in this repository
- No explicit `npm run seed` script yet (startup seed is present)

## Possible Improvements

- Add `.env.example` with safe defaults and comments
- Add explicit manual seed command (`npm run seed`)
- Add healthcheck endpoint and Compose healthcheck for MongoDB
- Add CI workflow for lint/test/build
- Add API documentation and Postman collection export
- Add stronger password policy and account lockout strategy
- Improve container image optimization (multi-stage build, `npm ci`, non-root user)

## Recruiter-Friendly Demo Flow

1. `docker compose up --build`
2. Open http://localhost:3000
3. Sign in using local demo admin account
4. Show course/news/admin pages
5. Stop with `docker compose down`
