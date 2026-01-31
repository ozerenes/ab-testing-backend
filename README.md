# A/B Testing Platform API

Production-style Node.js + Express backend for an A/B testing platform. In-memory storage only (no database).

## Architecture

- **Thin controllers:** Controllers only delegate to services and map HTTP responses; business logic and validation live in the service layer.
- **Deterministic assignment:** Same `(experimentId, userId)` always receives the same variant via SHA-256 hashing and weighted buckets.
- **Event tracking:** View, click, and conversion events are stored per experiment and variant for metrics and conversion rates.
- **In-memory storage:** No database; suitable for demos and single-instance deployments. Persistence can be added by swapping the storage layer.

## Structure

```
src/
├── app.js              # Express app, CORS, middleware, route mounting
├── server.js           # Entry point, starts HTTP server
├── config/             # Configuration (env, port, CORS origin)
├── routes/             # Route definitions
├── controllers/        # Request/response handling (thin)
├── services/           # Business logic
├── storage/            # In-memory stores (experiments, variants, assignments, events)
├── utils/              # Shared controller helpers (sendData, handleServiceError)
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
- **CORS:** Frontend origin configurable via `CORS_ORIGIN` (default `http://localhost:5173`)

## API

Base path: `/api`. Responses use `{ data: ... }` for success; errors use `{ error: "message" }`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| **Experiments** | | |
| GET | `/api/experiments` | List experiments |
| GET | `/api/experiments/:id` | Get experiment (with variants) |
| GET | `/api/experiments/:id/stats` | Aggregated stats (views, clicks, conversions, conversion rate) |
| POST | `/api/experiments` | Create experiment |
| PATCH | `/api/experiments/:id` | Update experiment |
| DELETE | `/api/experiments/:id` | Delete experiment |
| **Variants** | | |
| GET | `/api/variants` | List variants (optional `?experimentId=`) |
| GET | `/api/variants/:id` | Get variant |
| POST | `/api/variants` | Create variant |
| PATCH | `/api/variants/:id` | Update variant |
| DELETE | `/api/variants/:id` | Delete variant |
| **Assignments** | | |
| GET | `/api/assignments/:experimentId/users/:userId` | Get user's assigned variant |
| POST | `/api/assignments/:experimentId/users/:userId` | Assign variant (deterministic, weighted) |
| **Events** | | |
| POST | `/api/events` | Track event (view, click, conversion) |

### Event payload (POST /api/events)

```json
{
  "experimentId": "1",
  "variantKey": "control",
  "eventType": "view",
  "userId": "user-123",
  "sessionId": "sess-456",
  "metadata": {}
}
```

`eventType` must be one of: `view`, `click`, `conversion`. `userId`, `sessionId`, `metadata` are optional.

## Examples

```bash
# Create experiment with variants
curl -X POST http://localhost:3000/api/experiments -H "Content-Type: application/json" \
  -d '{"name":"Homepage CTA","description":"Button test","variants":[{"key":"control","weight":50},{"key":"variant-b","weight":50}]}'

# Assign user to a variant (deterministic)
curl -X POST http://localhost:3000/api/assignments/1/users/user-123

# Track events
curl -X POST http://localhost:3000/api/events -H "Content-Type: application/json" \
  -d '{"experimentId":"1","variantKey":"control","eventType":"view","userId":"user-123"}'
curl -X POST http://localhost:3000/api/events -H "Content-Type: application/json" \
  -d '{"experimentId":"1","variantKey":"control","eventType":"conversion","userId":"user-123"}'

# Get experiment stats (views, clicks, conversions, conversion rate)
curl http://localhost:3000/api/experiments/1/stats
```

## Requirements

- Node.js >= 18
