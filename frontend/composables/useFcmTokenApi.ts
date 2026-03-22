import { apiFetch } from '~/utils/apiFetch'

export const useFcmTokenApi = () => {
  const registerToken = async (token: string, platform: string) => {
    return await apiFetch('/fcm-tokens', {
      method: 'POST',
      body: { token, platform }
    })
  }

  const removeToken = async (token: string) => {
    return await apiFetch('/fcm-tokens', {
      method: 'DELETE',
      body: { token }
    })
  }

  return { registerToken, removeToken }
}
