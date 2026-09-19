# PingPong — Production Power Upgrade (2026-09-08)

## Implemented code-level upgrades

- PostgreSQL connection pool, transactions, health checks and migration runner.
- Production relational schema for auth sessions, idempotency, wallet operations, recharge/withdrawal records, agencies/hosts, salary/commission, KYC, notifications, audit events, uploads and room events.
- Existing Module-4 wallet ledger activated by the production bootstrap and legacy Diamonds/Beans opening-balance hydration.
- Atomic cross-currency wallet transfer and atomic batch transfer for multi-recipient gifts.
- Production wallet authority wired into Diamonds/Beans gift, recharge-compatible, Fruit Wheel, exchange and game-sync paths in the main server where applicable.
- Refresh-token rotation/session storage in PostgreSQL; network errors are not treated as logout conditions by this layer.
- Redis-backed distributed rate limiter with safe local fallback.
- Idempotency middleware/database table for retry-safe financial HTTP operations.
- S3/R2-compatible object-storage abstraction plus upload magic-byte/type/size validation and upload metadata table.
- Production-grade profile photo and admin Frame upload paths use the storage abstraction; local Termux remains supported when not in production.
- `/api/ready` and `/api/production/health` endpoints.
- Production bootstrap/check scripts and expanded `.env.example`.
- Existing Socket.IO Redis adapter, presence, room state, voice state, SFU/Agora/LiveKit infrastructure retained and integrated rather than replaced.
- Existing RBAC/security/CSP/CORS/brute-force/rate-limiting/audit infrastructure retained.

## Important deployment contract

Production requires a real PostgreSQL database and S3-compatible object storage. Redis is required for horizontal scaling and distributed coordination. Voice SFU/TURN credentials must be configured before enabling the corresponding production voice mode.

The repository cannot truthfully claim a live Railway/PostgreSQL/Redis/SFU smoke test from the offline build environment. The included production preflight/check scripts are intended to run against the real deployment before traffic is switched over.
