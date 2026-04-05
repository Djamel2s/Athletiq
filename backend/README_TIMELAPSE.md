Server-side timelapse generation

Requirements
- ffmpeg must be installed and available on PATH.
  - macOS: `brew install ffmpeg`
  - Windows (Chocolatey): `choco install ffmpeg`
  - Linux (Debian/Ubuntu): `sudo apt install ffmpeg`
- Cloudinary credentials set in environment: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Quick test (local)
1. Start backend in dev with DB skip (if you don't have a local DB):

```powershell
$env:SKIP_DB='true'; npm run dev
```

2. Use the provided test script to call the generate endpoint (requires JWT env secret):

```powershell
node scripts/test_timelapse.mjs
```

Notes
- If `ffmpeg` is not available the endpoint will return HTTP 501 with a short message explaining how to install `ffmpeg`.
- The endpoint expects an Authorization `Bearer <token>` header. The test script uses `JWT_ACCESS_SECRET` or `JWT_SECRET` from your `.env` to sign a short-lived token.
- If you cannot run `ffmpeg` locally, consider calling `/api/photos/timelapse/upload` with a pre-rendered MP4 file instead (uses the Cloudinary upload route).
