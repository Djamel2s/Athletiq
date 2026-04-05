/**
 * Minimal helper for attempting native story share flows on mobile.
 * - Best-effort: tries Capacitor Share, then Android intent URL, then fallback to opening public URL.
 * - This is a safe, non-invasive stub: it never throws and always returns an object describing the outcome.
 */
export async function shareToStory(opts: {
  url?: string // public url (Cloudinary)
  backgroundImageUrl?: string
  blob?: Blob
  stickerUrl?: string
  attributionLink?: string
}) {
  try {
    function blobToBase64(blob: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const dataUrl = reader.result as string
          const base64 = dataUrl.split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    }

    // Try native Capacitor plugin if available (plugin will handle writing blob to FS)
    try {
      const { shareToStoryNative } = await import('~/plugins/story-plugin')
      const res = await shareToStoryNative({ blob: opts.blob, url: opts.url, attribution: opts.attribution })
      if (res?.available) return { success: true, method: 'native-plugin' }
    } catch (e) {
      // continue
    }
    // Try Capacitor Share first (native platforms)
    try {
      // dynamic import to avoid bundling in web
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { Share } = await import('@capacitor/share')

      // If we have a blob, write to filesystem first to improve story intents compatibility
      if (opts.blob) {
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { Filesystem, Directory } = await import('@capacitor/filesystem')
          const base64 = await blobToBase64(opts.blob)
          const filename = `athletiq-story-${Date.now()}.jpg`
          await Filesystem.writeFile({ path: filename, data: base64, directory: Directory.Data })
          // Attempt to get a URI for the file
          // @ts-ignore
          const uriRes = await Filesystem.getUri({ directory: Directory.Data, path: filename })
          const nativeUri = uriRes.uri || uriRes.uri
          // Use native share with file URI when possible
          await Share.share({ title: 'Mon timelapse', text: opts.attributionLink || '', url: nativeUri })
          return { success: true, method: 'capacitor-share' }
        } catch (e) {
          // Fall back to Share with public URL below
        }
      }

      await Share.share({ title: 'Mon timelapse', text: opts.attributionLink || '', url: opts.url })
      return { success: true, method: 'capacitor-share' }
    } catch (e) {
      // continue
    }

    // Try Android intent deep link for Instagram story (best-effort)
    if (typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)) {
      // Prefer local blob path for Android intent if available
      if (opts.blob) {
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const { Filesystem, Directory } = await import('@capacitor/filesystem')
          const base64 = await blobToBase64(opts.blob)
          const filename = `athletiq-story-${Date.now()}.jpg`
          await Filesystem.writeFile({ path: filename, data: base64, directory: Directory.Data })
          // @ts-ignore
          const uriRes = await Filesystem.getUri({ directory: Directory.Data, path: filename })
          const nativeUri = uriRes.uri || uriRes.uri
          const intent = `intent://instagram.com/stories/create?background_image=${encodeURIComponent(nativeUri)}#Intent;package=com.instagram.android;scheme=https;end`;
          window.location.href = intent
          return { success: true, method: 'android-intent' }
        } catch (e) {
          // fallback to remote URL below
        }
      }

      if (opts.backgroundImageUrl) {
        const intent = `intent://instagram.com/stories/create?background_image=${encodeURIComponent(opts.backgroundImageUrl)}#Intent;package=com.instagram.android;scheme=https;end`;
        window.location.href = intent
        return { success: true, method: 'android-intent' }
      }
    }

    // As a last resort, open the public URL so the user can share manually to any app
    if (opts.url) {
      window.open(opts.url, '_blank')
      return { success: true, method: 'open-url' }
    }

    return { success: false }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export default function useSocialStoryShare() {
  return { shareToStory }
}
