// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sentry = require('@sentry/nestjs');

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sampleRate: 1.0,
  tracesSampleRate: 1.0,
  profilesSampler: 1.0,
  environment: 'localhost',
  integrations: [Sentry.nestIntegration(), Sentry.graphqlIntegration()],
});
