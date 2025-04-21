import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Grid,
    Box
  } from '@mui/material';
  import { useState, useEffect } from 'react';
  // import { getAllBoards } from '../api/boardsService';
  // import { getAllUsers } from '../api/usersService';
import { updateTask } from '../api/tasksService';
import { useNavigate } from "react-router";
import { useAppData } from '../context/appDataContext';

  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['Backlog', 'InProgress', 'Done'];
  
  export default function EditTaskModal({ open, onClose, boardId, updateTaskList, task = {}  }) {
    const navigate = useNavigate()
    const {boards,users}= useAppData()
    const [form, setForm] = useState({
      title: task?.title,
      description: task?.description,
      priority: task.priority,
      status: task.status,
      assigneeId: task.assignee.id,
      boardId: boardId,
    });
  
console.log("users",users)


    const handleUpdateTask = async () => {
       const response= await updateTask(task.id,form)
       updateTaskList({fromId:task.id,fromStatus:task.status,newTask:{...form,id:task.id, assignee:task.assignee}})
       onClose()
       console.log("response form update task",response)
    }
    
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? 'Edit Task' : 'Редактировать адачу'}</DialogTitle>
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
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    }}
  >
    <Button variant="contained" onClick={() => navigate(`/board/${boardId}`)}>
    Перейти к доску
    </Button>

    <Box>
      <Button onClick={onClose} sx={{ mr: 1 }}>
        Отменить
      </Button>
      <Button variant="contained" onClick={handleUpdateTask}>
        обновить
      </Button>
    </Box>
  </Box>
</DialogActions>

      </Dialog>
    );
  }
  