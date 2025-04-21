import { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, CircularProgress,Box } from '@mui/material';
import { getAllBoards } from '../api/boardsService';
import { getAllUsers } from '../api/usersService';
import { useAppData } from '../context/appDataContext';



export default function BoardsPage() {
  const {boards,loading,users} = useAppData()
  const navigate = useNavigate();



  

  // Loading indicator in case data is taking time to get fetched
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Grid container justifyContent="center" spacing={3} sx={{ px: 2 }}>
        <Grid item xs={12} sm={10} md={8} lg={6}>
          {boards.map((board) => (
                  
            <Box key={board.id} my={2}>
              <Card
                key={board.id}
                onClick={() => navigate(`/board/${board.id}`)}
                sx={{
                  cursor: 'pointer',
                  transition: '0.3s',
                  '&:hover': { boxShadow: 6 },
                  backgroundColor: 'light-gray',
                  width: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6">{board.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {board.description || 'No description'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    🧩 Задачи: {board.taskCount}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>
      </Grid>
    </>
  );
  
}




