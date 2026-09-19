'use strict';

const { assertSafeProduction } = require('../integration_update/config');
const { run } = require('../integration_update/database');

(async () => {
  try {
    assertSafeProduction();
  } catch (err) {
    console.error('[production-start] configuration check failed:', err.message);
    process.exit(1);
  }

  try {
    await run({ databaseUrl: process.env.DATABASE_URL });
    console.log('[production-start] PostgreSQL migration/initialization completed.');
  } catch (err) {
    console.error('[production-start] PostgreSQL initialization failed — starting application anyway:', err.message);
    console.error('[production-start] PostgreSQL must be repaired separately; application startup is not blocked.');
  }

  try {
    require('../server.js');
  } catch (err) {
    console.error('[production-start] server startup failed:', err);
    process.exit(1);
  }
})();
