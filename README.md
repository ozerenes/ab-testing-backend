# A/B Testing Platform API

Production-style Node.js + Express backend for an A/B testing platform. In-memory storage only (no database).

## Structure

```
src/
├── app.js              # Express app, middleware, route mounting
├── server.js           # Entry point, starts HTTP server
├── config/             # Configuration (env, port)
├── routes/             # Route definitions
├── controllers/        # Request/response handling
├── services/           # Business logic
├── storage/            # In-memory stores (experiments, variants, assignments)
└── middleware/         # Error handler, not found
```

## Setup

```bash
npm install
cp .env.example .env   # optional
npm start
```

- **Start:** `npm start` (port from `PORT` or 3000)
- **Dev (watch):** `npm run dev`

## API

Base path: `/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/experiments` | List experiments |
| GET | `/api/experiments/:id` | Get experiment (with variants) |
| POST | `/api/experiments` | Create experiment |
| PATCH | `/api/experiments/:id` | Update experiment |
| DELETE | `/api/experiments/:id` | Delete experiment |
| GET | `/api/variants` | List variants (optional `?experimentId=`) |
| GET | `/api/variants/:id` | Get variant |
| POST | `/api/variants` | Create variant |
| PATCH | `/api/variants/:id` | Update variant |
| DELETE | `/api/variants/:id` | Delete variant |
| GET | `/api/assignments/:experimentId/users/:userId` | Get assignment |
| POST | `/api/assignments/:experimentId/users/:userId` | Assign variant (weighted) |

## Example

```bash
# Create experiment
curl -X POST http://localhost:3000/api/experiments -H "Content-Type: application/json" -d '{"name":"Homepage CTA","status":"running"}'

# Add variants
curl -X POST http://localhost:3000/api/variants -H "Content-Type: application/json" -d '{"experimentId":"1","name":"control","trafficWeight":50}'
curl -X POST http://localhost:3000/api/variants -H "Content-Type: application/json" -d '{"experimentId":"1","name":"variant-b","trafficWeight":50}'

# Assign user to a variant
curl -X POST http://localhost:3000/api/assignments/1/users/user-123
```

## Requirements

- Node.js >= 18
