// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sentry = require('@sentry/nestjs');

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sampleRate: 1.0,
  tracesSampleRate: 1.0,
  profilesSampler: () => 1.0,
  environment: 'localhost',
  integrations: [Sentry.graphqlIntegration()],
  beforeSendTransaction(transactionEvent) {
    if (transactionEvent.spans) {
      for (const span of transactionEvent.spans) {
        const operationType = span.data?.['graphql.operation.type'];
        const operationName = span.data?.['graphql.operation.name'];
        if (
          typeof operationType === 'string' &&
          typeof operationName === 'string'
        ) {
          transactionEvent.transaction = `${operationType} ${operationName}`;
          break;
        }
      }
    }
    return transactionEvent;
  },
});
