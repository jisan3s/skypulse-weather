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

- `Home`, `Forecast`, and `Details` are configured for client rendering in `src/app/app.routes.server.ts`
- Route components are lazy-loaded in `src/app/app.routes.ts`
- This keeps SSR complexity away from geolocation and local-storage-driven screens while still preserving Angular SSR support for future static routes

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
- The app intentionally avoids prerendering the interactive weather routes because their first render depends on browser APIs
