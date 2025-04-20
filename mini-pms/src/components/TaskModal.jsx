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
  import {useState } from 'react';
  
  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['Backlog', 'InProgress', 'Done'];
  
  export default function TaskModal({ open, onClose, onSubmit, initialData = {}, users = [] }) {
    const [form, setForm] = useState({
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Backlog',
      assigneeId: 0,
      boardId: 1,
      ...initialData,
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = () => {
      onSubmit(form);
      // console.log(form)
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
            <Grid item xs={20}>

            <TextField
              select
              label="Assignee"
              name="assigneeId"
              fullWidth
              value={form.assigneeId}
              onChange={handleChange}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.fullName}
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
  