import api from './axios';

export const getAllTasks = (signal) =>
  api.get('/tasks', { signal }).then(res => res.data);

export const getTaskById = (taskId, signal) =>
  api.get(`/tasks/${taskId}`, { signal }).then(res => res.data);

export const createTask = (taskData) =>
  api.post('/tasks/create', taskData).then(res => res.data);

export const updateTask = (taskId, taskData) =>
  api.put(`/tasks/update/${taskId}`, taskData).then(res => res.data);

// export const updateTaskStatus = (taskId, status) =>
//   api.put(`/tasks/updateStatus/${taskId}`, { status }).then(res => res.data);

export const updateTaskStatus = (taskId, newStatus) => {
  return api.put(`/tasks/updateStatus/${taskId}`, {
    status: newStatus,
  }).then(res => res.data);
};