import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';

export default function Layout() {
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Mini PMS
          </Typography>
          <Button color="inherit" onClick={() => navigate('/boards')}>Boards</Button>
          <Button color="inherit" onClick={() => navigate('/issues')}>All Tasks</Button>
          <Button color="inherit" onClick={() => alert('🔧 Open Task Creation Modal (to do)')}>
            + Create Task
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ paddingY: 3 }}>
        <Outlet />
      </Container>
    </>
  );
}
