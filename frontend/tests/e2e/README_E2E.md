E2E test for timelapse share flow

What this test does:

- Launches a Playwright browser and navigates to the frontend (dashboard)
- Intercepts `POST /api/photos/timelapse/upload` and mocks a Cloudinary URL
- Clicks the "Exporter en video" button and asserts the upload request was made

Prerequisites

- Frontend dev server running (default `http://localhost:3000`) or set `FRONTEND_URL`
- Backend running (default `http://localhost:3001/api`) or set `NUXT_PUBLIC_API_URL`
- Playwright installed in the workspace (recommended global or devDependency)

Quick run (from `frontend`):

1. Install Playwright (if not already):

```bash
npm i -D @playwright/test
npx playwright install
```

2. Run the test:

```bash
# from frontend folder
npx playwright test tests/e2e/timelapse.spec.ts --project=chromium
```

Notes

- Headless browsers may not fully emulate MediaRecorder/canvas behavior; this test focuses on verifying the upload network call.
- For a full device-level E2E (real Instagram/Snapchat), run tests on real devices or using Firebase Test Lab / BrowserStack with the built Android app.
- Adjust `FRONTEND_URL` and `NUXT_PUBLIC_API_URL` env vars when running the test if your servers run on different ports.
