import { apiFetch } from '~/utils/apiFetch';

export const useSocialApi = () => {
  const getMyProfile = () => apiFetch('/profile/me');
  const getProfile = (username: string) => apiFetch(`/profile/${username}`);
  const updateProfile = (data: { username?: string; bio?: string; isPublic?: boolean }) =>
    apiFetch('/profile', { method: 'PUT', body: data });
  const checkUsername = (username: string) => apiFetch(`/profile/check-username/${username}`);
  const searchUsers = (query: string) => apiFetch(`/social/search?q=${encodeURIComponent(query)}`);
  const sendFriendRequest = (userId: number) =>
    apiFetch(`/social/request/${userId}`, { method: 'POST' });
  const acceptRequest = (friendshipId: number) =>
    apiFetch(`/social/accept/${friendshipId}`, { method: 'POST' });
  const rejectRequest = (friendshipId: number) =>
    apiFetch(`/social/reject/${friendshipId}`, { method: 'POST' });
  const removeFriend = (userId: number) =>
    apiFetch(`/social/remove/${userId}`, { method: 'DELETE' });
  const blockUser = (userId: number) => apiFetch(`/social/block/${userId}`, { method: 'POST' });
  const getFriends = () => apiFetch('/social/friends');
  const getRequests = () => apiFetch('/social/requests');
  const getFeed = (offset = 0) => apiFetch(`/feed?offset=${offset}`);
  const createPost = (data: { type: string; data: any }) =>
    apiFetch('/feed', { method: 'POST', body: data });
  const reactToPost = (postId: number) => apiFetch(`/feed/${postId}/react`, { method: 'POST' });
  const deletePost = (postId: number) => apiFetch(`/feed/${postId}`, { method: 'DELETE' });

  // Planned workouts
  const createPlannedWorkout = (data: {
    inviteeId: number;
    name: string;
    scheduledAt: string;
    workoutTemplateId?: number;
    notes?: string;
  }) => apiFetch('/planned-workouts', { method: 'POST', body: data });
  const acceptPlannedWorkout = (id: number) =>
    apiFetch(`/planned-workouts/${id}/accept`, { method: 'POST' });
  const declinePlannedWorkout = (id: number) =>
    apiFetch(`/planned-workouts/${id}/decline`, { method: 'POST' });
  const getPlannedWorkouts = () => apiFetch<{ plannedWorkouts: any[] }>('/planned-workouts');
  const cancelPlannedWorkout = (id: number) =>
    apiFetch(`/planned-workouts/${id}`, { method: 'DELETE' });

  return {
    getMyProfile,
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
    deletePost,
    createPlannedWorkout,
    acceptPlannedWorkout,
    declinePlannedWorkout,
    getPlannedWorkouts,
    cancelPlannedWorkout,
  };
};
