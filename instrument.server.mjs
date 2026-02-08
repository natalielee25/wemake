import * as Sentry from "@sentry/react-router";
Sentry.init({
  dsn: "https://dfd60c1fed0b9abe99e25084eef297fe@o4510844750856192.ingest.de.sentry.io/4510844754526288",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});