import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useTaskModal } from '../context/TaskModalContext';
import TaskModal from './TaskModal';

export default function Layout() {
  const navigate = useNavigate();
  const { handleOpen } = useTaskModal()

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Mini PMS
          </Typography>
          <Button color="inherit" onClick={() => navigate('/boards')}>Проекты</Button>
          <Button color="inherit" onClick={() => navigate('/issues')}>Все задачи</Button>
          <TaskModal/>
        </Toolbar>
      </AppBar>

      <Container sx={{ paddingY: 3 }}>
        <Outlet />
      </Container>
    </>
  );
}
