// export default function TasksPage() {
//     return <h2>🧾 All Tasks Page</h2>;
//   }
  // ---------------------------



  // src/pages/TasksPage.jsx
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { getAllTasks } from '../api/tasksService';
import { getAllBoards } from '../api/boardsService';
import { getAllUsers } from '../api/usersService';
import { useTaskModal } from '../context/TaskModalContext';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [boardFilter, setBoardFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [assigneeSearch, setAssigneeSearch] = useState('');

  const { openModal } = useTaskModal();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskData, boardData, userData] = await Promise.all([
          getAllTasks(),
          getAllBoards(),
          getAllUsers()
        ]);
        setTasks(taskData);
        setBoards(boardData);
        setUsers(userData);
      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    return (
      (statusFilter ? task.status === statusFilter : true) &&
      (boardFilter ? task.boardId === parseInt(boardFilter) : true) &&
      (searchTerm ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
      (assigneeSearch ? task.assignee?.fullName.toLowerCase().includes(assigneeSearch.toLowerCase()) : true)
    );
  });

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">Все задачи</Typography>
        <Button variant="contained" onClick={() => openModal(null)}>
          Создать задачу
        </Button>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Поиск по названию"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Поиск по исполнителю"
            fullWidth
            value={assigneeSearch}
            onChange={(e) => setAssigneeSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Фильтр по статусу"
            fullWidth
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Фильтр по доске"
            fullWidth
            value={boardFilter}
            onChange={(e) => setBoardFilter(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {boards.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                {board.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {filteredTasks.map((task) => (
          <Grid item xs={12} key={task.id}>
            <Card
              sx={{ cursor: 'pointer' }}
              onClick={() => openModal(task)}
            >
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography color="text.secondary">{task.description}</Typography>
                <Typography variant="body2" mt={1}>
                  Статус: {task.status} | Приоритет: {task.priority}
                </Typography>
                <Typography variant="body2">
                  Назначено: {task.assignee?.fullName || 'Не указано'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
