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
import { getAllBoards } from '../api/boardsService';

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Backlog', 'InProgress', 'Done'];

export default function TaskModal({ open, onClose, onSubmit, initialData = {}, users = [] }) {
  const [boards, setBoards] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Backlog',
    assigneeId: '',
    boardId: '',
    ...initialData,
  });

  // useEffect(() => {
  //   setForm({
  //     title: '',
  //     description: '',
  //     priority: 'Medium',
  //     status: 'Backlog',
  //     assigneeId: '',
  //     boardId: '',
  //     ...initialData,
  //   });
  // }, [initialData]);

  
  
  

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getAllBoards();
        if (Array.isArray(data)) {
          setBoards(data);
        } else {
          console.error('Expected array but got:', data);
        }
      } catch (err) {
        console.error('❌ Failed to fetch boards:', err.message);
      }
    };

    fetchBoards();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{form.id ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={form.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
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
              label="Priority"
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
              label="Status"
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
              label="Assignee"
              name="assigneeId"
              fullWidth
              value={form.assigneeId}
              onChange={handleChange}
              sx={{ minWidth: 115 }}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.fullName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Project (Board)"
              name="boardId"
              value={form.boardId}
              onChange={handleChange}
              sx={{ minWidth: 150 }}
              fullWidth
            >
              {boards.map((board) => (
                <MenuItem key={board.id} value={board.id}>
                  {board.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {form.id ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
