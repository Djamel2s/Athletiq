import { test, expect } from '@playwright/test';

// Requires frontend running locally (e.g., `npm run dev` in frontend)
// and backend running (or at least reachable) at NUXT_PUBLIC_API_URL or default http://localhost:3001/api

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';
const API_BASE = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001/api';

test('timelapse export triggers backend upload', async ({ page }) => {
  let uploadCalled = false;

  // Intercept upload request and mock successful Cloudinary response
  await page.route(`${API_BASE}/photos/timelapse/upload`, async (route) => {
    uploadCalled = true;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ url: 'https://res.cloudinary.com/demo/video/upload/v12345/out.mp4' }),
    });
  });

  // Navigate to a page that contains the TimelapseViewer (adjust path if needed)
  await page.goto(`${FRONTEND}/dashboard`);

  // Wait for the export button to be available
  const btn = page.getByRole('button', { name: /Exporter en video/i });
  await expect(btn).toBeVisible({ timeout: 5000 });

  // Click export — the app will perform MediaRecorder logic; for headless browsers
  // the MediaRecorder might not capture from canvas as expected; the goal here is to
  // validate that the frontend attempts to upload (i.e., hits the endpoint).
  await btn.click();

  // Wait a bit for the upload to be triggered
  await page.waitForTimeout(3000);

  expect(uploadCalled).toBeTruthy();
});
