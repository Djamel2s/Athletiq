import { ref } from 'vue'

let socketInstance: any = null

export const useSocket = () => {
  const connected = ref(false)

  const connect = async (token: string) => {
    if (socketInstance?.connected) return socketInstance

    // Dynamic import to avoid SSR issues
    const { io } = await import('socket.io-client')
    const config = useRuntimeConfig()
    const apiUrl = (config.public.apiUrl as string).replace('/api', '')

    socketInstance = io(apiUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => { connected.value = true })
    socketInstance.on('disconnect', () => { connected.value = false })

    return socketInstance
  }

  const disconnect = () => {
    if (socketInstance) {
      socketInstance.disconnect()
      socketInstance = null
      connected.value = false
    }
  }

  const getSocket = () => socketInstance

  return { connect, disconnect, getSocket, connected }
}
