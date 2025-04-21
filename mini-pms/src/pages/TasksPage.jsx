import React, { useState, useEffect,useMemo } from 'react';
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import { getAllTasks } from '../api/tasksService';
import { getAllBoards } from '../api/boardsService';
import EditTaskModal from '../components/TaskEdit';
import {updateTask } from "../api/tasksService";
import { useAppData } from '../context/appDataContext';

export default function TasksPage() {
  const [open,setOpen]=useState(false)
  const [selectedTask,setSelectedTask]=useState({})
  const {tasks,boards,loading}= useAppData()
  const [assignees, setAssignees] = useState([]);
  const [filters, setFilters] = useState({
    search:"",
    taskName: '',
    assignee: '',
    status: '',
    board: '',
  });
  console.log({tasks})

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

const filteredTasks = useMemo(()=>tasks.filter((task) => {
    const searchValue = filters.search ? filters.search.toLowerCase() : '';
    const matchesSearch =
      !searchValue ||
      task.title.toLowerCase().includes(searchValue) ||
      (task.assignee?.fullName && task.assignee.fullName.toLowerCase().includes(searchValue));
    return (
      matchesSearch &&
      (filters.assignee === '' || task.assignee?.fullName === filters.assignee) &&
      (filters.status === '' || task.status === filters.status) &&
      (filters.board === '' || task.boardName === filters.board)
    );
  }),[tasks, filters]);;
  

  const handleClearFilters = () => {
    setFilters({
      search:"",
      taskName: '',
      assignee: '',
      status: '',
      board: '',
    });
  };



  useEffect(() => {
    if(assignees.length > 0) return; 
    const uniqueAssignees = tasks.reduce((acc, task) => {
      if (task.assignee && !acc.some((assignee) => assignee.id === task.assignee.id)) {
        acc.push(task.assignee);
      }
      return acc;
    }, []);
    setAssignees(uniqueAssignees);
  }, [tasks]);

  const handleEditTask = (task) => {
    setOpen(true)
    setSelectedTask(task)
  }
  console.log({tasks,boards})

  const handleUpdateTask = (task)=>{
    tasks.map((item) => {
      if(task.newTask.id ==item.id){
        return task
      }
      return item
    })
  }
console.log("rerender")
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧾 Управление Задачами
      </Typography>
      {open && <EditTaskModal 
      open={open} 
      onClose={()=>setOpen(false)} 
      boardId={selectedTask.id} 
      updateTaskList={(task)=>handleUpdateTask(task)} 
      task = {selectedTask}
      />}
      <Paper sx={{ p: 3, mb: 3, boxShadow: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          {/* Left side filters (TextField + Selects) */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Поиск (назв.. задач./исполни.)"
                  name="search"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value.toLowerCase() }))
                  }
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Статус</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label="status"
                    sx={{ minWidth: 100 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Backlog">To do</MenuItem>
                    <MenuItem value="InProgress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Доска</InputLabel>
                  <Select
                    name="board"
                    value={filters.board}
                    onChange={handleFilterChange}
                    label="Board"
                    sx={{ minWidth: 100 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {boards.map((board) => (
                      <MenuItem key={board.id} value={board.name}>
                        {board.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Right aligned Clear Filters button */}
          <Grid item xs={12} md="auto">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearFilters}
              sx={{ mt: { xs: 2, md: 0 } }}
            >
              Очистить фильтры
            </Button>
          </Grid>
        </Grid>

      </Paper>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Отфильтрованные задачи
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ px: 2 }}>
            {filteredTasks.map((task) => (
              <Grid item xs={12} md={4} key={task.id} backgroundColor="white">
                <Paper 
                onClick={()=>handleEditTask(task)}
                  sx={{
                    width: '100%',
                    p: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: '#f9f9f9',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {task.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Assignee:</strong> {task.assignee?.fullName || 'Unassigned'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Status:</strong> {task.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Board:</strong> {task.boardName}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
 );
}