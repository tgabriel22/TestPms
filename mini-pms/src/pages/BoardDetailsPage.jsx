import { useEffect, useState,useRef,useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import { getBoardTasks } from '../api/boardsService';
import {updateTask } from "../api/tasksService";



// const COLUMNS = ['To do', 'In Progress', 'Done'];


function getTasksFilter(tasks){
  return {
    Backlog: tasks?.filter(q => q.status == "Backlog")?.sort((a,b)=>a.id-b.id)||[],
    InProgress: tasks?.filter(q => q.status == "InProgress")?.sort((a,b)=>a.id-b.id)||[],
    Done: tasks?.filter(q => q.status == "Done")?.sort((a,b)=>a.id-b.id)||[]
  }
}

export default function BoardDetailsPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState();
  const [loading, setLoading] = useState(true);
  const dragItemIndex = useRef(null)
  const dragOvertItemIndex = useRef(null)
  const [draggedIndex, setDraggedIndex] = useState(null);



  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getBoardTasks(id);
        console.log("data",data)
        const initTasks =getTasksFilter(data)
        setTasks(initTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [id]);


  function handleDragStart({index,status}) {
    dragItemIndex.current = {
      index,
      status
    }
    setDraggedIndex(index)
  }

  function handleDragOver({e,index,status}) {
    e.preventDefault()
    dragOvertItemIndex.current={index,status}
  }

  function handleDragEnd(e){
    setDraggedIndex(null)
    e.preventDefault()
      dragItemIndex.current=null
      dragOvertItemIndex.current=null
  
    }

    function swapSameArrayItems(arr,i,j){
      return arr.map((item,index)=>{
        if(index ===i)return arr[j]
        if(index ===j)return arr[i]
        return item
      })
    }

    function swapDifferentArrayItems({fromArray,toArray,fromIndex,toIndex}){
      const op1 = fromArray.map((item,idx)=>{
        if (idx == fromIndex) {
          item=toArray[toIndex]
        }
        return item
      })
      const op2 = toArray.map((item, idx) => {
        if( idx === toIndex){
          item = fromArray[fromIndex]
        }
        return item
      })
      return { fromArray: op1, toArray: op2 }
    }

    function handleDrop() {
      const from = dragItemIndex.current
      const to = dragOvertItemIndex.current
      const fromIndex = from.index
      const toIndex = to.index
      const fromArr= [...tasks[from.status]]
      const toArr = [...tasks[to.status]]
      console.log("tasks",tasks)
      setTasks(async (prev) => {
        if (from.status == to.status) {
          const cloneArray = prev[from.status]
          const swapped = swapSameArrayItems(cloneArray, from.index, to.index)
          return {
            ...prev,
            [from.status]:swapped
          }
        }
        const toElement = toArr[toIndex]
        toElement.status = from.status
        const fromElement = fromArr[fromIndex]
        fromElement.status = to.status
        await updateTask(fromElement.id,fromElement)
        await updateTask(toElement.id,toElement)
        const { fromArray ,toArray}=swapDifferentArrayItems({array1:fromArr,array2:toArr,i:fromIndex,j:toIndex})
        console.log({fromArray ,toArray})
        return {
          ...prev,
          [from.status]:fromArray,
          [to.status]:toArray
        }
        
      })
      console.log("tasks",tasks)
  
    }
      if (loading) return <CircularProgress sx={{ m: 3 }} />;

  return (
    <Grid container spacing={2}>
      {Object.keys(tasks).map((status) => (
        <Grid item xs={12} md={2} key={status} >
          <Paper  sx={{ p: 2, minHeight: '80vh' }}>
            <Typography variant="h6" align="center" gutterBottom>
              {status}
            </Typography>
            <Box  sx={{ minHeight: '70vh' }}>
            {tasks[status]?.map((task,index) => (
                <Box
                  draggable
                onDragStart={()=>{handleDragStart({index,status})}}
                onDragOver={(e)=>{handleDragOver({e,index,status})}}
                onDragEnd={(e)=>handleDragEnd(e)}
                 onDrop={handleDrop}
                  key={index}
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    p: 1,
                    mb: 1,
                    opacity: 1,
                    marginTop: index===1 ? 2 : 0,
                    backgroundColor: draggedIndex === index ? 'lightGray' : '#fff',
                    cursor: 'grab'
                  }}
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





















// --------------------------------------------------------------------------------------------

// import { useEffect, useState,useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Grid,
//   Paper,
//   Typography,
//   CircularProgress,
//   Box
// } from '@mui/material';
// import { getBoardTasks } from '../api/boardsService';
// import { useCancelableRequest } from '../hooks/useCancelableRequest';


// const COLUMNS = ['Backlog', 'InProgress', 'Done'];

// export default function BoardDetailsPage() {
//   const { id } = useParams();
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const getSignal = useCancelableRequest();
//   const dragItemIndex = useRef(null)
//   const dragOvertItemIndex = useRef(null)


//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const data = await getBoardTasks(id, getSignal());
//         console.log("data",data)
//         setTasks(data);
//       } catch (err) {
//         console.error('Error fetching tasks:', err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, [id]);

//   console.log("tasks", tasks)

//   function handleDragStart(index) {
//     dragItemIndex.current = index
//   }

//   function handleDragOver(index) {
//     dragOvertItemIndex.current=index
//   }

//   function handleDragEnd(){

//   }

//   function handleDrop() {
//     const from = dragItemIndex.current
//     const to = dragOvertItemIndex.current
//     if (!from || !to) {
//       return
//     }
//     const clone = [...tasks]
//     const [movedItem] = clone.splice(from,1)
//     clone.splice(to, 0, movedItem)
//     setTasks(clone)
//     dragItemIndex.current=null
//     dragOvertItemIndex.current=null
//   }

//   const getTasksByStatus = (status) =>
//     tasks.filter((task) => task.status === status);

//   if (loading) return <CircularProgress sx={{ m: 3 }} />;

//   return (
//     <Grid container spacing={2}>
//       {COLUMNS.map((status) => (
//         <Grid item xs={12} md={2} key={status} >
//           <Paper  sx={{ p: 2, minHeight: '80vh' }}>
//             <Typography variant="h6" align="center" gutterBottom>
//               {status}
//             </Typography>
//             <Box  sx={{ minHeight: '70vh' }}>
//               {getTasksByStatus(status).map((task,index) => (
//                 <Box
//                   style={{padding:"2px", margin:"4px", border:"2px solid black"}}
//                   draggable
//                 onDragStart={()=>{handleDragStart(index)}}
//                 onDragOver={()=>{handleDragOver(index)}}
//                 onDragEnd={()=>{console.log("drag end")}}
//                 onDrop={()=>{handleDrop()}}
//                   key={task.id}

//                   // sx={{
//                   //   border: '1px solid #ccc',
//                   //   borderRadius: 1,
//                   //   p: 1,
//                   //   mb: 1,
//                   //   backgroundColor: 'green',
//                   // }}
//                 >
//                   <Typography variant="subtitle1">{task.title}</Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {task.description}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//           </Paper>
//         </Grid>
//       ))}
//     </Grid>
//   );
// }
// ---------------------------------------------------------------------------------------