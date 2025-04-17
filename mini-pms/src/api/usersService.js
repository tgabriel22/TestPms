import api from './axios';

export const getAllUsers = (signal) =>
  api.get('/users', { signal }).then(res => res.data);

export const getUserTasks = (userId, signal) =>
  api.get(`/users/${userId}/tasks`, { signal }).then(res => res.data);
