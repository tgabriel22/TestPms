import { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, CircularProgress,Box } from '@mui/material';
import { getAllBoards } from '../api/boardsService';
import { getAllUsers } from '../api/usersService';



export default function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);


// ------------------------------------------------

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        console.log('Fetching users:', data);
        setUsers(data);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('🛑 Users request canceled');
          console.log('Error name:', err.name);
        } else {
          console.error('❌ Failed to load users:', err.message);
        }
      }
    };
  
    fetchUsers();
  }, []);


// -------------------------------------------------------
// Fetching all Projects(Boards)
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getAllBoards();
        console.log('🔍 Fetched boards:', data);
        console.log('Object keys:', Object.keys(data));
          console.log("board",data)
        if (Array.isArray(data)) {
          setBoards(data);
        } else {
          console.error('Expected array but got:', data);
          setBoards([]);
        }
      } catch (err) {
        console.error('❌ Failed to fetch boards:', err.message);
        setBoards([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBoards();
  }, []);
  

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
                    🧩 Tasks: {board.taskCount}
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




