# SkyPulse Weather

SkyPulse is an Angular 21 weather dashboard built around Open-Meteo data. It uses client-side rendering for its data-heavy routes because the app depends on browser-only capabilities such as geolocation, local storage theme persistence, and client-triggered refreshes.

## Features

- Live weather dashboard with cached Open-Meteo data
- City search using Open-Meteo geocoding
- Forecast and details pages that share the same weather state
- Centralized weather facade for data loading, refresh cadence, and cache management
- Theme service with persisted light/dark mode
- Typed API models and behavior-focused unit tests

## Rendering Strategy

- `Home`, `Forecast`, and `Details` are client-rendered routes
- Route components are lazy-loaded in `src/app/app.routes.ts`
- The app is built as a static SPA, which is a better fit for browser-only features such as geolocation and local storage

## Development

Install dependencies and run the dev server:

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Commands

```bash
npm start
npm run build
npm test -- --watch=false
```

## Deploy To Render

This project is configured for a Render Static Site deployment.

1. Push the repository to GitHub.
2. In Render, create a new `Static Site` from the repo.
3. Use these settings if Render does not auto-detect them:

```bash
Build Command: npm install && npm run build
Publish Directory: dist/skypulse-weather
```

The included [`render.yaml`](./render.yaml) also defines a catch-all rewrite to `/index.html` so Angular routes like `/forecast` and `/details` work correctly after refreshes.

## Deploy To GitHub Pages

This repo also includes a GitHub Pages workflow at [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml).

1. Push the repository to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` to trigger the deploy workflow.

The workflow builds the app with a repo-aware base href of `/skypulse-weather/` and creates a `404.html` fallback so Angular routes continue to work on refresh.

## Project Structure

- `src/app/core/models`: typed API models
- `src/app/core/services`: weather, geocoding, and theme services
- `src/app/core/store`: shared store and weather facade
- `src/app/features/weather/pages/home`: dashboard
- `src/app/features/forecast/pages/forecast`: next-hours forecast view
- `src/app/features/details/pages/details`: current metrics detail view
- `src/app/shared/components`: reusable navbar and loader

## Notes

- Weather responses are cached in memory and in `localStorage` with automatic cleanup of stale entries
- The charting library is route-lazy-loaded with the home page, which reduced the initial bundle compared to the previous eager setup
- The app intentionally stays browser-rendered because its interactive routes depend on browser APIs
