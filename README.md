# Course & News Management Platform

Node.js, Express, MongoDB, and Handlebars portfolio project for managing courses, news, users, and admin workflows.

## Tech Stack

- Node.js 20
- Express 5
- MongoDB + Mongoose
- express-session + connect-mongo
- Handlebars
- Jest + Supertest
- Docker + Docker Compose
- GitHub Actions

## Local Development

Install dependencies from the lockfile:

```bash
npm ci
```

Create a local `.env` file from [.env.example](.env.example), then run:

```bash
npm run start
```

The current `start` script uses `nodemon --inspect src/index.js`, so it is intended for local development. The Docker image runs the production entrypoint directly with `node src/index.js`.

Run tests:

```bash
npm test
```

## Docker

Start the full app stack with MongoDB:

```bash
docker compose up --build
```

Stop containers without deleting the MongoDB volume:

```bash
docker compose down
```

Inspect logs:

```bash
docker compose logs -f
```

The Compose app service connects to MongoDB through Docker networking:

```text
mongodb://mongo:27017/baokim_prod
```

Override the host port with `APP_PORT` and the container database URI with `APP_MONGO_URI` when needed.

## Health Check

```http
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

Docker Compose and GitHub Actions use this endpoint to verify the application starts correctly.

## CI

GitHub Actions runs:

```text
tests
-> Docker build
-> Docker Compose integration startup
-> /health check
-> Docker Hub image publish on main
```

Pull requests run tests plus Docker/Compose health checks. Pushes to `main` also publish the Docker image after those checks pass.

## GitHub Secrets

Configure these repository secrets before Docker Hub publishing:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

The workflow publishes:

```text
<DOCKERHUB_USERNAME>/my-backend-app:latest
<DOCKERHUB_USERNAME>/my-backend-app:<git-sha>
```

Change `IMAGE_NAME` in [.github/workflows/ci.yml](.github/workflows/ci.yml) if your Docker Hub repository name is different.

## Project Structure

```text
.
|- Dockerfile
|- docker-compose.yml
|- package.json
|- scripts/
|- src/
|  |- index.js
|  |- app/
|  |- config/
|  |- middleware/
|  |- resources/
|  |- routes/
|  |- util/
|- __tests__/
```
