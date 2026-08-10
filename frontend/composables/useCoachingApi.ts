import { apiFetch } from '~/utils/apiFetch';

export interface CoachStatus {
  isCoach: boolean;
  coachInviteCode: string | null;
  coachBio: string | null;
  coachPlan: 'FREE' | 'PRO';
  clientCount: number;
  maxClients: number | null;
}

export interface CoachLinkPermissions {
  canViewWorkouts: boolean;
  canViewPhotos: boolean;
  canViewMeasurements: boolean;
  canViewBodyStats: boolean;
  canAssignPrograms: boolean;
}

export interface CoachClientSummary {
  linkId: number;
  athlete: {
    id: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    avatarUrl?: string;
  };
  permissions: CoachLinkPermissions;
  lastWorkoutAt: string | null;
  clientSince: string;
}

export interface MyCoachEntry {
  linkId: number;
  coach: {
    id: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    avatarUrl?: string;
    coachBio?: string;
  };
  status: 'PENDING' | 'ACTIVE' | 'REVOKED';
  permissions: CoachLinkPermissions;
  since: string;
}

export const useCoachingApi = () => {
  // --- Espace coach ---
  const getCoachStatus = () => apiFetch<CoachStatus>('/coaching/status');
  const becomeCoach = () => apiFetch<CoachStatus>('/coaching/become-coach', { method: 'POST' });
  const updateCoachProfile = (data: { coachBio?: string }) =>
    apiFetch('/coaching/profile', { method: 'PATCH', body: data });

  const getClients = () => apiFetch<{ clients: CoachClientSummary[] }>('/coaching/clients');
  const getClientOverview = (athleteId: number) =>
    apiFetch<any>(`/coaching/clients/${athleteId}`);
  const inviteClient = (identifier: string) =>
    apiFetch('/coaching/invite', { method: 'POST', body: { identifier } });
  const assignProgram = (athleteId: number, slug: string, note?: string) =>
    apiFetch(`/coaching/clients/${athleteId}/assign-program`, {
      method: 'POST',
      body: { slug, note },
    });
  const addNote = (athleteId: number, content: string, workoutId?: number) =>
    apiFetch(`/coaching/clients/${athleteId}/notes`, {
      method: 'POST',
      body: { content, workoutId },
    });
  const getClientNotes = (athleteId: number) =>
    apiFetch<{ notes: any[] }>(`/coaching/clients/${athleteId}/notes`);

  // --- Côté athlète ---
  const getMyCoaches = () =>
    apiFetch<{ coaches: MyCoachEntry[]; pendingInvites: MyCoachEntry[] }>('/coaching/my-coaches');
  const getMyNotes = () => apiFetch<{ notes: any[] }>('/coaching/my-notes');
  const joinByCode = (code: string) => apiFetch(`/coaching/join/${code}`, { method: 'POST' });
  const acceptInvite = (linkId: number) =>
    apiFetch(`/coaching/links/${linkId}/accept`, { method: 'POST' });
  const declineInvite = (linkId: number) =>
    apiFetch(`/coaching/links/${linkId}/decline`, { method: 'POST' });
  const updatePermissions = (linkId: number, perms: Partial<CoachLinkPermissions>) =>
    apiFetch(`/coaching/links/${linkId}/permissions`, { method: 'PATCH', body: perms });
  const revokeLink = (linkId: number) =>
    apiFetch(`/coaching/links/${linkId}`, { method: 'DELETE' });

  return {
    getCoachStatus,
    becomeCoach,
    updateCoachProfile,
    getClients,
    getClientOverview,
    inviteClient,
    assignProgram,
    addNote,
    getClientNotes,
    getMyCoaches,
    getMyNotes,
    joinByCode,
    acceptInvite,
    declineInvite,
    updatePermissions,
    revokeLink,
  };
};
