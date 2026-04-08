Instagram & Snapchat Story Sharing — Integration Notes

Problem

- Web share APIs do not reliably support posting to Instagram/Snapchat Stories.
- Native story share requires platform SDKs (Instagram/Facebook/ Snapchat) or using Android Intents / iOS URL schemes.

Options (ordered by reliability)

1. Native SDKs (recommended for production)
   - Instagram: use IG Story Share (Android Intent or iOS UIActivity with IG hook) or Instagram Graph API for content publication (requires permissions).
   - Snapchat: use Snap Kit (Creative Kit) to share to Stories (sticker/background, attribution URL).
   - Requires adding native SDKs to Capacitor Android/iOS projects and implementing bridging code or using existing Capacitor plugins.

2. Android Intent (fast win)
   - Format: `intent://instagram.com/stories/create?background_image=<url>#Intent;package=com.instagram.android;scheme=https;end`
   - Works best when the image is local (content:// or file://). For remote URLs, results may vary.
   - Implement via `window.location.href = intent` or a small native Capacitor plugin.

3. Fallback: upload an MP4/image to Cloudinary and open the public URL
   - Users can then share manually to Story from the OS share sheet.
   - This is what the current `/api/photos/timelapse/upload` endpoint provides.

Implementation checklist

- Backend: ensure `POST /api/photos/timelapse/upload` returns a public, CORS-friendly URL (done).
- Frontend (mobile): add a Capacitor plugin or use `@capacitor/share` for generic share; for story-specific behavior, implement native code:
  - Android: create an Intent with extras (background/sticker) and startActivity.
  - iOS: use `UIApplication` + pasteboard or use official SDK methods.
- UX: if story-share fails, fallback to opening the Cloudinary URL and show a small help overlay explaining how to share to Stories.

Permissions & Review

- Instagram / Snapchat SDKs may require app review for certain permissions or to use API endpoints; plan for privacy (GDPR: ask consent for photos) and for credential storage.

Developer notes

- Test on real devices (emulators often lack Instagram/Snapchat apps).
- For maximum compatibility, prefer local file paths for images passed to SDKs; use Capacitor filesystem to write the file locally before invoking native share.

Example (Android Intent - quick):

```js
const intent = `intent://instagram.com/stories/create?background_image=${encodeURIComponent(localFileUrl)}#Intent;package=com.instagram.android;scheme=https;end`;
window.location.href = intent;
```

If you want, I can:

- Implement the Android intent flow (Capacitor + small plugin) as a fast win; or
- Start integrating official SDKs (longer, more robust) for both iOS/Android.

Which option do you want me to implement next? (I'll pick Android intent if you don't answer.)

Planned short-term work (I'll implement now):

- Add a small Capacitor Android plugin scaffold to reliably launch Instagram/Snapchat story intents with a local file URI.
- Add helper code in the frontend to write Blob -> Capacitor Filesystem -> call the plugin.
- Provide fallback UX: if plugin not available, open public URL and show share instructions.

Long-term (follow-up):

- Integrate Instagram & Snapchat official SDKs (Snap Kit / Facebook SDK) for robust story templates, stickers and attribution.
- Automated testing on real devices via Appium or Firebase Test Lab.

I will now scaffold the Android plugin bridge (JS side) and frontend helper to call it; actual native Java/Kotlin files will be scaffolded but require building the Android project to test.
