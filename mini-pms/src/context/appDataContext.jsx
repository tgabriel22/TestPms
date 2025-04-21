import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getAllBoards } from '../api/boardsService';
import { getAllTasks } from '../api/tasksService';
import { getAllUsers } from '../api/usersService';


// Создаём контекст для данных приложения
const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  // Состояния для хранения данных
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // Получение данных при загрузке компонента
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Получение данных при загрузке компонента
        const [boardsData, tasksData, usersData] = await Promise.all([
          getAllBoards(),
          getAllTasks(),
          getAllUsers()
        ]);
        // Устанавливаем данные
        setBoards(Array.isArray(boardsData) ? boardsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setTasks(tasksData?.data || []);
      } catch (error) {
         // В случае ошибки сбрасываем данные
        setBoards([]);
        setTasks([]);
        setUsers([]);
      } finally {
        setLoading(false); // отключаем индикатор загрузки
      }
    };
    fetchData();
  }, []);
  // Мемоизированная фильтрация задач по статусу
  const filteredTasks = useMemo(() => ({
    Backlog: tasks.filter(q => q.status === "Backlog").sort((a, b) => a.id - b.id),
    InProgress: tasks.filter(q => q.status === "InProgress").sort((a, b) => a.id - b.id),
    Done: tasks.filter(q => q.status === "Done").sort((a, b) => a.id - b.id)
  }), [tasks]);
  // Управление модальным окном создания задачи
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
// Хук для использования контекста в компонентах
export function useAppData() {
  return useContext(AppDataContext);
}