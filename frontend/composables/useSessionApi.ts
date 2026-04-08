import { apiFetch } from '~/utils/apiFetch';

export const useSessionApi = () => {
  const createSession = () => apiFetch('/sessions', { method: 'POST' });
  const joinSession = (code: string) => apiFetch(`/sessions/${code}/join`, { method: 'POST' });
  const joinSessionLocal = (code: string, email: string, password: string) =>
    apiFetch(`/sessions/${code}/join-local`, { method: 'POST', body: { email, password } });
  const getSession = (code: string) => apiFetch(`/sessions/${code}`);
  const startSession = (id: number) => apiFetch(`/sessions/${id}/start`, { method: 'POST' });
  const pauseSession = (id: number) => apiFetch(`/sessions/${id}/pause`, { method: 'POST' });
  const resumeSession = (id: number) => apiFetch(`/sessions/${id}/resume`, { method: 'POST' });
  const leaveSession = (id: number) => apiFetch(`/sessions/${id}/leave`, { method: 'POST' });
  const endSession = (id: number) => apiFetch(`/sessions/${id}/end`, { method: 'POST' });
  const setWorkout = (id: number, workoutId: number) =>
    apiFetch(`/sessions/${id}/set-workout`, { method: 'POST', body: { workoutId } });

  return {
    createSession,
    joinSession,
    joinSessionLocal,
    getSession,
    startSession,
    pauseSession,
    resumeSession,
    leaveSession,
    endSession,
    setWorkout,
  };
};
