import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import TaskModal from './TaskModal';
import { useAppData } from '../context/appDataContext';


// Функция фильтрации задач по статусу
function getTasksFilter(tasks){
  return {
    Backlog: tasks?.filter(q => q.status == "Backlog")?.sort((a,b)=>a.id-b.id)||[],
    InProgress: tasks?.filter(q => q.status == "InProgress")?.sort((a,b)=>a.id-b.id)||[],
    Done: tasks?.filter(q => q.status == "Done")?.sort((a,b)=>a.id-b.id)||[]
  }
}

export default function Layout() {
  const navigate = useNavigate();// Хук для навигации
  const {
    loading,
  } = useAppData();// Получаем состояние загрузки из контекста
  return (
    <>
      <AppBar position="static" color="primary" backgroundcolor="red" Box sx={{ border: 3 }}>
        <Toolbar>
          {/* Название приложения с переходом на главную */}
          <Typography backgroundcolor="red" variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Mini PMS
          </Typography>
          <Button color="inherit" onClick={() => navigate('/boards')}>Проекты</Button>
          <Button color="inherit" onClick={() => navigate('/issues')}>Все задачи</Button>
          {/* Кнопка и модальное окно создания задачи */}
          <TaskModal/>
        </Toolbar>
      </AppBar>
         {/* Основной контейнер для отображения страниц */}
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
