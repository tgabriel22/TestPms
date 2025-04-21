import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getAllBoards } from '../api/boardsService';
import { getAllTasks } from '../api/tasksService';
import { getAllUsers } from '../api/usersService';

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [boardsData, tasksData, usersData] = await Promise.all([
          getAllBoards(),
          getAllTasks(),
          getAllUsers()
        ]);
        setBoards(Array.isArray(boardsData) ? boardsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setTasks(tasksData?.data || []);
      } catch (error) {
        setBoards([]);
        setTasks([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTasks = useMemo(() => ({
    Backlog: tasks.filter(q => q.status === "Backlog").sort((a, b) => a.id - b.id),
    InProgress: tasks.filter(q => q.status === "InProgress").sort((a, b) => a.id - b.id),
    Done: tasks.filter(q => q.status === "Done").sort((a, b) => a.id - b.id)
  }), [tasks]);

  const openTaskModal = () => setTaskModalOpen(true);
  const closeTaskModal = () => setTaskModalOpen(false);

  return (
    <AppDataContext.Provider value={{
      boards, setBoards,
      tasks, setTasks,
      users, setUsers,
      loading,
      filteredTasks,
      taskModalOpen,
      openTaskModal,
      closeTaskModal
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}