# Bukid ni Manang - Client

This is the frontend client for the Bukid ni Manang booking demo (Vite + React + TypeScript).

Quick start (Windows PowerShell):

```powershell
# From the client/ folder
npm install
npm run dev
# In a separate terminal to run tests
npm run test
```

Notes:
- The app uses in-memory mock data in `src/data/mockData.ts` for bookings, users, and accommodations.
- Booking and payment flows are simulated and stored in-memory; refreshing the page resets state.
- Tests use Vitest and Testing Library; ensure dependencies are installed before running.

What I changed:
- Added `test` script to `package.json` and dev/test dependencies for running Vitest.
- Added basic README with run/test commands.

If you want, I can run the test suite here (if your environment allows), or help you run it locally and interpret failures.
