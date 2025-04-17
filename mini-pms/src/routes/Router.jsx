import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import BoardsPage from '../pages/BoardsPage';
import BoardDetailsPage from '../pages/BoardDetailsPage';
import TasksPage from '../pages/TasksPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <BoardsPage /> },
      { path: '/boards', element: <BoardsPage /> },
      { path: '/board/:id', element: <BoardDetailsPage /> },
      { path: '/issues', element: <TasksPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
