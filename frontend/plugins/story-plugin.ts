// Minimal JS bridge for a Capacitor native plugin `StoryPlugin`.
// This is a safe shim: if the native plugin is not installed, methods resolve to { available: false }.
// JS shim for native StoryPlugin.
// Adds helper to write a Blob to Capacitor Filesystem and call the native plugin with the file URI.
async function blobToBase64(blob: Blob) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read blob'))
    reader.onload = () => {
      const data = reader.result as string
      // data is like 'data:<mime>;base64,AAAA...'
      const idx = data.indexOf(',')
      resolve(data.slice(idx + 1))
    }
    reader.readAsDataURL(blob)
  })
}

export async function shareToStoryNative(options: { blob?: Blob; fileUri?: string; url?: string; attribution?: string }) {
  try {
    // Dynamic import to avoid bundling issues on web
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cap = await import('@capacitor/core')
    // @ts-ignore
    const Plugins = cap.Plugins || (cap as any).Capacitor?.Plugins
    if (!Plugins || !Plugins.StoryPlugin) {
      return { available: false }
    }

    let fileUri = options.fileUri

    if (options.blob && !fileUri) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { Filesystem, Directory } = await import('@capacitor/filesystem')
        const base64 = await blobToBase64(options.blob)
        const filename = `athletiq-story-${Date.now()}.jpg`
        await Filesystem.writeFile({ path: filename, data: base64, directory: Directory.Data })
        // @ts-ignore
        const uriRes = await Filesystem.getUri({ directory: Directory.Data, path: filename })
        fileUri = uriRes.uri || uriRes.uri
      } catch (e) {
        // writing failed — continue without fileUri
      }
    }

    const res = await Plugins.StoryPlugin.shareToStory({ fileUri, url: options.url, attribution: options.attribution })
    return { available: true, result: res }
  } catch (e) {
    return { available: false, error: String(e) }
  }
}

export default { shareToStoryNative }
