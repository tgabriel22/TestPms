import api from './axios';

export const getAllUsers = () =>
  api.get('/users').then(res => res.data.data); 

export const getUserTasks = (userId) =>
  api.get(`/users/${userId}/tasks`).then(res => res.data);