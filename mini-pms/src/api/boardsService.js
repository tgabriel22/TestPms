
import api from './axios';

export const getAllBoards = () =>
  api.get('/boards').then(res => res.data.data);

export const getBoardTasks = (boardId) =>
  api.get(`/boards/${boardId}`).then(res => res.data.data);

