import {reactRouter} from "@react-router/dev/vite";
import {
  sentryReactRouter,
  type SentryReactRouterBuildOptions
} from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: process.env.SENTRY_ORG ?? "nat-m5",
  project: process.env.SENTRY_PROJECT ?? "wemake",
  authToken: process.env.SENTRY_AUTH_TOKEN
  // ...
};


export default defineConfig(config => {
  return {
    plugins: [tailwindcss(),reactRouter(), sentryReactRouter(sentryConfig, config)],
    build: {
      sourcemap: true,
    },
    sentryConfig,
  };
});
