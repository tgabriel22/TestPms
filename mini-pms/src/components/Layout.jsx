import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
// import { useTaskModal } from '../context/TaskModalContext';
import TaskModal from './TaskModal';
// import {useState,useEffect} from "react"
// import { getAllBoards } from '../api/boardsService';
// import { getAllTasks } from '../api/tasksService';
// import { getAllUsers } from '../api/usersService';
import { useAppData } from '../context/appDataContext';


function getTasksFilter(tasks){
  return {
    Backlog: tasks?.filter(q => q.status == "Backlog")?.sort((a,b)=>a.id-b.id)||[],
    InProgress: tasks?.filter(q => q.status == "InProgress")?.sort((a,b)=>a.id-b.id)||[],
    Done: tasks?.filter(q => q.status == "Done")?.sort((a,b)=>a.id-b.id)||[]
  }
}

export default function Layout() {
  const navigate = useNavigate();
  const {
    loading,
  } = useAppData();
  return (
    <>
      <AppBar position="static" color="primary" backgroundcolor="red" Box sx={{ border: 3 }}>
        <Toolbar>
          <Typography backgroundcolor="red" variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Mini PMS
          </Typography>
          <Button color="inherit" onClick={() => navigate('/boards')}>Проекты</Button>
          <Button color="inherit" onClick={() => navigate('/issues')}>Все задачи</Button>
          <TaskModal/>
        </Toolbar>
      </AppBar>

      <Container sx={{ paddingY: 3 }}>
        {
          loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Typography variant="h6">Загрузка...</Typography>
            </Box>
          ):(
        <Outlet  />
          )
        }
      </Container>
    </>
  );
}
