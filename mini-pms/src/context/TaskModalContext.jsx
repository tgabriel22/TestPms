// src/context/TaskModalContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import TaskModal from '../components/TaskModal';
import { getAllUsers } from '../api/usersService';
import { createTask } from '../api/tasksService';

const TaskModalContext = createContext();

export const TaskModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    <TaskModalContext.Provider value={{ handleOpen }}>
      {children}
      <TaskModal open={open} onClose={handleClose} onSubmit={handleSubmit} users={users} />
    </TaskModalContext.Provider>
  );
};

export const useTaskModal = () => useContext(TaskModalContext);
