# Tenant and occupancy dashboard

A browser-based dashboard for tenant records, room/parking allocation and rent summaries.

**Status:** Local prototype with browser storage; no multi-user server or production access control is established.

## Scope

- Add, edit and remove tenant records through modal forms.
- Calculate occupied area, parking costs and rent summaries.
- CSV export for tenant and occupancy views.
- Persist tenant state with localStorage.

## Technology

React, TypeScript, Vite.

## Architecture and source map

- `App.tsx` — state, calculations, dashboards and exports
- `components/TenantModal.tsx` — record editor
- `types.ts` — data types
- `constants.ts` — initial room, parking and tenant data

## Local development

Requires Node.js and npm. From the repository root:

```sh
npm install
npm run dev
```

Build command declared by this checkout: `npm run build`.

These are the repository scripts, not a claim of a passing build. Dependency installation, build and live integrations were not executed during the documentation review.

## Configuration and limitations

Data is stored in the browser, not in a shared database. Existing initial data is not reproduced here; replace it with synthetic fixtures before any public demonstration. Validate storage initialization and backup/export behavior before relying on it for real records.

## Portfolio relevance

Demonstrates practical administrative automation, data modelling and CSV reporting.

## Documentation next steps

Capture screenshots using synthetic data, document a reproducible test run, and record which integrations have been verified. Keep credentials and deployment-specific configuration outside version control.
