import api from './axios';

export const getAllTeams = () =>
  api.get('/teams').then(res => res.data);

export const getTeamById = (teamId) =>
  api.get(`/teams/${teamId}`).then(res => res.data);
