import { ref } from 'vue'

export async function shareBlob(blob: Blob, filename: string, title = '') {
	// Try Web Share API with files
	try {
		const file = new File([blob], filename, { type: blob.type })
		// @ts-ignore canShare with files
		if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
			await (navigator as any).share({ files: [file], title })
			return { success: true }
		}
	} catch (e) {
		// continue to other fallbacks
	}

	// Capacitor mobile fallback (dynamic import to avoid bundling on web)
	try {
		// dynamic import via Function to avoid bundler resolving Capacitor packages
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const cap = await (new Function("return import('@capacitor/core')") as any)()
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { Filesystem, Share } = await (new Function("return import('@capacitor/filesystem')") as any)()
		const base64 = await blobToBase64(blob)
		const path = `athletiq/${filename}`
		// @ts-ignore
		await Filesystem.writeFile({ path, data: base64, directory: cap.FilesystemDirectory.Data })
		// @ts-ignore
		await Share.share({ title, text: '', url: '', dialogTitle: title })
		return { success: true }
	} catch (e) {
		// not on capacitor or error, continue
	}

	// Fallback: trigger download
	try {
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		a.remove()
		URL.revokeObjectURL(url)
		return { success: true, downloaded: true }
	} catch (e) {
		return { success: false }
	}
}

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

export default function useShare() {
	const sharing = ref(false)
	return { shareBlob, sharing }
}
