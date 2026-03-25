import { apiFetch } from '~/utils/apiFetch'

export const useSocialApi = () => {
  const getProfile = (username: string) => apiFetch(`/profile/${username}`)
  const updateProfile = (data: { username?: string; bio?: string; isPublic?: boolean }) => apiFetch('/profile', { method: 'PUT', body: data })
  const checkUsername = (username: string) => apiFetch(`/profile/check-username/${username}`)
  const searchUsers = (query: string) => apiFetch(`/social/search?q=${encodeURIComponent(query)}`)
  const sendFriendRequest = (userId: number) => apiFetch(`/social/request/${userId}`, { method: 'POST' })
  const acceptRequest = (friendshipId: number) => apiFetch(`/social/accept/${friendshipId}`, { method: 'POST' })
  const rejectRequest = (friendshipId: number) => apiFetch(`/social/reject/${friendshipId}`, { method: 'POST' })
  const removeFriend = (userId: number) => apiFetch(`/social/remove/${userId}`, { method: 'DELETE' })
  const blockUser = (userId: number) => apiFetch(`/social/block/${userId}`, { method: 'POST' })
  const getFriends = () => apiFetch('/social/friends')
  const getRequests = () => apiFetch('/social/requests')
  const getFeed = (offset = 0) => apiFetch(`/feed?offset=${offset}`)
  const createPost = (data: { type: string; data: any }) => apiFetch('/feed', { method: 'POST', body: data })
  const reactToPost = (postId: number) => apiFetch(`/feed/${postId}/react`, { method: 'POST' })
  const deletePost = (postId: number) => apiFetch(`/feed/${postId}`, { method: 'DELETE' })

  return {
    getProfile,
    updateProfile,
    checkUsername,
    searchUsers,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    blockUser,
    getFriends,
    getRequests,
    getFeed,
    createPost,
    reactToPost,
    deletePost
  }
}
