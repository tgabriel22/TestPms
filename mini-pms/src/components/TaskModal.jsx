import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import { useState, useEffect } from 'react';
import { createTask } from '../api/tasksService';
import { useAppData } from '../context/appDataContext';

// Возможные значения для приоритета и статуса
const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Backlog', 'InProgress', 'Done'];

export default function TaskModal() {
  const {boards,users}= useAppData()// Получаем список досок и пользователей из глобального контекста

  // Локальное состояние для управления модальным окном
  const [open,setOpen]= useState(false)

  // Начальное состояние формы задачи
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    assigneeId: '',
    boardId: '',
  });


   // Обработка изменений в полях формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (formData) => {
    try {
      await createTask(form);
      console.log('✅ Task created!');
      setOpen(false);
    } catch (err) {
      console.error('❌ Failed to create task:', err.message);
    }
  };

  return (
    <>
     {/* Кнопка, которая открывает модальное окно создания задачи */}
    <Button
      id="global-create-task-button"
      color="inherit"
      sx={{ color: 'white' }}
      onClick={() => {
        setForm({
          title: '',
          description: '',
          priority: '',
          status: '',
          assigneeId: '',
          boardId: '',
        });
        setOpen(true);
      }}
    >
      + Создать задачу
  </Button>
    <Dialog open={open} onClose={()=>setOpen(false)}  fullWidth maxWidth="sm">
      <DialogTitle >  Создать Задачу</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12}>
            <TextField
              label="Название"
              name="title"
              fullWidth
              value={form.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Описание"
              name="description"
              multiline
              rows={4}
              fullWidth
              value={form.description}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Приоритет"
              name="priority"
              sx={{ minWidth: 150 }}
              fullWidth
              value={form.priority}
              onChange={handleChange}
            >
              {priorities.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Статус"
              name="status"
              sx={{ minWidth: 150 }}
              fullWidth
              value={form.status}
              onChange={handleChange}
            >
              {statuses.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Исполнитель"
              name="assigneeId"
              fullWidth
              value={form.assigneeId}
              onChange={handleChange}
              sx={{ minWidth: 115 }}
            >
              {users?.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.fullName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Проект"
              name="boardId"
              value={form.boardId}
              onChange={handleChange}
              sx={{ minWidth: 150 }}
              fullWidth
            >
              {boards?.map((board) => (
                <MenuItem key={board.id} value={board.id}>
                  {board.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={()=>setOpen(false)}>отменить</Button>
        <Button onClick={handleSubmit} variant="contained" >
         Создать
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
