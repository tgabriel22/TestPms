import { createContext, useContext, useState, useEffect } from 'react';
import TaskModal from '../components/TaskModal';
import { getAllUsers } from '../api/usersService';
import { createTask } from '../api/tasksService';


// Создаём контекст для управления модальным окном задач
const TaskModalContext = createContext();

export const TaskModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false); // Управление открытием/закрытием модального окна
  const [users, setUsers] = useState([]);// Храним список пользователей
  const [initialData, setInitialData] = useState(null); // Данные задачи, если редактируем
  

  // Функция для открытия модального окна (можно передавать задачу или null)
  const openModal = () => {
    setInitialData(task);// если task === null → создаём новую задачу
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  // Получаем список пользователей один раз при монтировании компонента
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await createTask(formData);
      console.log('✅ Task created!');
      setOpen(false);
    } catch (err) {
      console.error('❌ Failed to create task:', err.message);
    }
  };

  return (
    <TaskModalContext.Provider value={{ openModal }}>
      {children}
      <TaskModal open={open} onOpen={openModal} onClose={closeModal} onSubmit={handleSubmit} users={users} initialData={initialData}/>
    </TaskModalContext.Provider>
  );
};

export const useTaskModal = () => useContext(TaskModalContext);
