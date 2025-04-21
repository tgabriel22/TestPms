import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import BoardsPage from './pages/BoardsPage';
import TasksPage from './pages/TasksPage';
import BoardDetailsPage from './pages/BoardDetailsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/boards" />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/issues" element={<TasksPage />} />
        <Route path="/board/:id" element={<BoardDetailsPage />} />
      </Route>
    </Routes>
  );
}
