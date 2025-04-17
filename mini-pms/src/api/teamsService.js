import api from './axios';

export const getAllTeams = (signal) =>
  api.get('/teams', { signal }).then(res => res.data);

export const getTeamById = (teamId, signal) =>
  api.get(`/teams/${teamId}`, { signal }).then(res => res.data);
