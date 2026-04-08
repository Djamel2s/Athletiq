import { defineNuxtPlugin } from '#app';

async function blobToBase64(blob: Blob) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.onload = () => {
      const data = reader.result as string;
      const idx = data.indexOf(',');
      resolve(data.slice(idx + 1));
    };
    reader.readAsDataURL(blob);
  });
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      shareToStoryNative: async (options: {
        blob?: Blob;
        fileUri?: string;
        url?: string;
        attribution?: string;
      }) => {
        try {
          // dynamic import of Capacitor core and filesystem only on client
          // dynamic import; prevent Vite from resolving during build
          // dynamic import via Function to avoid bundler static analysis
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const cap = await (new Function("return import('@capacitor/core')") as any)();
          // @ts-ignore
          const Plugins = cap.Plugins || (cap as any).Capacitor?.Plugins;
          if (!Plugins || !Plugins.StoryPlugin) {
            return { available: false };
          }

          let fileUri = (options as any).fileUri;

          if (options.blob && !fileUri) {
            try {
              // dynamic import via Function to avoid bundler static analysis
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const { Filesystem, Directory } = await (
                new Function("return import('@capacitor/filesystem')") as any
              )();
              const base64 = await blobToBase64(options.blob);
              const filename = `athletiq-story-${Date.now()}.jpg`;
              await Filesystem.writeFile({
                path: filename,
                data: base64,
                directory: Directory.Data,
              });
              // @ts-ignore
              const uriRes = await Filesystem.getUri({ directory: Directory.Data, path: filename });
              fileUri = uriRes.uri || (uriRes as any).uri;
            } catch (e) {
              // writing failed — continue without fileUri
            }
          }

          const res = await (Plugins as any).StoryPlugin.shareToStory({
            fileUri,
            url: options.url,
            attribution: options.attribution,
          });
          return { available: true, result: res };
        } catch (e) {
          return { available: false, error: String(e) };
        }
      },
    },
  };
});
