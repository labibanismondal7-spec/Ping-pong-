# PingPong Production Architecture

The legacy `server.js` remains the compatibility shell because the existing client and 200+ modules depend on its dependency-injection shape. New production responsibilities are isolated behind these boundaries:

- `routes/` — HTTP route registration
- `controllers/` — request/response orchestration
- `services/` — business operations
- `middleware/` — auth, idempotency, rate limiting and policy
- `repositories/` — PostgreSQL persistence boundaries
- `models/` — domain contracts
- `sockets/` — cross-instance socket operations
- `auth/` — session/auth flows
- `wallet/` — wallet/ledger operations
- `rooms/` — room domain
- `agency/` — agency/host domain
- `voice/` — voice/SFU integration boundary
- `admin/` — admin domain

`production/` is the bootstrap/composition layer. Existing features are intentionally not mass-moved in one risky change; they can be migrated one domain at a time behind these boundaries without breaking the current Android/web client.
