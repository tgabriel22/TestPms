import { useEffect, useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import { getBoardTasks } from '../api/boardsService';
import { useCancelableRequest } from '../hooks/useCancelableRequest';
import { green } from '@mui/material/colors';

const COLUMNS = ['Backlog', 'InProgress', 'Done'];

export default function BoardDetailsPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const getSignal = useCancelableRequest();
  const dragItemIndex = useRef(null)
  const dragOvertItemIndex = useRef(null)


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getBoardTasks(id, getSignal());
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [id]);

  function handleDragStart(index) {
    dragItemIndex.current = index
  }

  function handleDragOver(index) {
    dragOvertItemIndex.current=index
  }

  function handleDragEnd(){

  }

  function handleDrop() {
    const from = dragItemIndex.current
    const to = dragOvertItemIndex.current
    if (!from || !to) {
      return
    }
    const clone = [...tasks]
    const [movedItem] = clone.splice(from,1)
    clone.splice(to, 0, movedItem)
    setTasks(clone)
    dragItemIndex.current=null
    dragOvertItemIndex.current=null
  }

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  if (loading) return <CircularProgress sx={{ m: 3 }} />;

  return (
    <Grid container spacing={2}>
      {COLUMNS.map((status) => (
        <Grid item xs={12} md={2} key={status} >
          <Paper  sx={{ p: 2, minHeight: '80vh' }}>
            <Typography variant="h6" align="center" gutterBottom>
              {status}
            </Typography>
            <Box  sx={{ minHeight: '70vh' }}>
              {getTasksByStatus(status).map((task,index) => (
                <Box
                  style={{padding:"2px", margin:"4px", border:"2px solid black"}}
                  draggable
                onDragStart={()=>{handleDragStart(index)}}
                onDragOver={()=>{handleDragOver(index)}}
                onDragEnd={()=>{console.log("drag end")}}
                onDrop={()=>{handleDrop()}}
                  key={task.id}

                  // sx={{
                  //   border: '1px solid #ccc',
                  //   borderRadius: 1,
                  //   p: 1,
                  //   mb: 1,
                  //   backgroundColor: 'green',
                  // }}
                >
                  <Typography variant="subtitle1">{task.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
