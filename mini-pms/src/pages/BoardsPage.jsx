import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { getAllBoards } from '../api/boardsService';
import { useCancelableRequest } from '../hooks/useCancelableRequest';

export default function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getSignal = useCancelableRequest();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getAllBoards(getSignal());
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
  

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={3}>
      {boards.map((board) => (
        <Grid item xs={12} sm={6} md={4} key={board.id}>
          <Card
            onClick={() => navigate(`/board/${board.id}`)}
            sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 6 } }}
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
        </Grid>
      ))}
    </Grid>
  );
}




