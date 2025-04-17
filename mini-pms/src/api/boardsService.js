// export const getBoardTasks = (boardId, signal) =>
//     api.get(`/boards/${boardId}`, { signal }).then(res => res.data);
//   --------------------------------
import api from './axios';

export const getAllBoards = (signal) =>
  api.get('/boards', { signal }).then(res => res.data.data);

export const getBoardTasks = (boardId, signal) =>
  api.get(`/boards/${boardId}`, { signal }).then(res => res.data.data);


// -------------------------------------------



