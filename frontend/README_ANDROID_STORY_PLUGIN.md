Android Story Plugin (Capacitor) — Integration Guide

What I added
- `android/app/src/main/java/com/athletiq/capacitor/StoryPlugin.java`: a minimal Capacitor plugin scaffold that exposes `shareToStory({ fileUri, url })`.

Why
- Native story sharing is more reliable for Instagram/Snapchat than web share APIs. The plugin attempts to open the Instagram Story composer with a local file URI or falls back to a generic share of the public URL.

How to finish integration
1) File URIs & FileProvider
   - The plugin expects a content URI or file URI accessible by other apps. For files written via Capacitor `Filesystem`, expose them through a `FileProvider` in `AndroidManifest.xml` or convert to `content://` URIs.
   - Example provider entry (AndroidManifest.xml inside `<application>`):

```xml
<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.fileprovider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/file_paths" />
</provider>
```

And create `res/xml/file_paths.xml`:

```xml
<paths>
    <external-path name="external_files" path="." />
</paths>
```

2) Register plugin (Capacitor v4+)
   - If you use the Capacitor plugin system, add the plugin to `MainActivity` or to `capacitor.config` depending on project setup. For example in `MainActivity` (Java/Kotlin) register plugin class.

3) Permissions
   - Ensure you grant `READ_EXTERNAL_STORAGE`/`WRITE_EXTERNAL_STORAGE` where needed (target SDK variations).
   - Add runtime permission checks where applicable.

4) Test on device
   - Emulators often don't have Instagram/Snapchat installed. Test on a real Android device with Instagram installed.

5) Improve robustness
   - Add checks to see if Instagram app is installed before creating the intent; fallback to generic share when absent.
   - Use a temporary file provider and cleanup after share.

Notes
- This is a scaffold only: you should adapt the URIs, file provider authority, and intent extras to match how your app writes files and the version of Instagram/Snapchat you target.
- For production, consider implementing the official SDK integrations (Instagram/Facebook, Snap Kit) for richer templates and attribution.

If you want, I can now:
- Implement the FileProvider wiring and authority names in your Android project files and a helper to write the Blob and return a content URI ready for the plugin; or
- Implement the full plugin in Kotlin with safer checks and unit tests.

Which should I do next? (I'll implement FileProvider wiring + helper by default.)
