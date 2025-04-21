import { useEffect, useState,useRef,useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { getBoardTasks } from '../api/boardsService';
import {updateTask } from "../api/tasksService";
import EditTaskModal from '../components/TaskEdit';


// Функция для фильтрации задач по статусу
function getTasksFilter(tasks){
  return {
    Backlog: tasks?.filter(q => q.status == "Backlog")?.sort((a,b)=>a.id-b.id)||[],
    InProgress: tasks?.filter(q => q.status == "InProgress")?.sort((a,b)=>a.id-b.id)||[],
    Done: tasks?.filter(q => q.status == "Done")?.sort((a,b)=>a.id-b.id)||[]
  }
}

export default function BoardDetailsPage() {
  const { id } = useParams(); // Получаем ID доски из URL

  const [openModal,setOpenModal]= useState(false) // Состояние модального окна
  const [tasks, setTasks] = useState();
  const [loading, setLoading] = useState(true);

   // Переменные для drag-and-drop
  const dragItemIndex = useRef(null)
  const dragOvertItemIndex = useRef(null)
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [selectedTask,setSelectedTask]= useState() // Выбранная задача для редактирования


     // Загрузка задач при монтировании компонента
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

  // Начало перетаскивания
  function handleDragStart({index,status}) {
    dragItemIndex.current = {
      index,
      status
    }
    setDraggedIndex(index)
  }
 // Элемент на который наводимся
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
// Меняем задачи внутри одного столбца
    function swapSameArrayItems(arr,i,j){
      return arr.map((item,index)=>{
        if(index ===i)return arr[j]
        if(index ===j)return arr[i]
        return item
      })
    }
 // Меняем задачи между столбцами
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
// Обновление задач после перемещения
  async function swapAndUpdateTask({from,to,toArr,fromArr,toIndex,fromIndex}){
    if (from.status == to.status) {
      const cloneArray = tasks[from.status]
      const swapped = swapSameArrayItems(cloneArray, from.index, to.index)
      return {
        ...tasks,
        [from.status]:swapped
      }
    }
    console.log({from,to,toArr,fromArr,toIndex,fromIndex})
    const { fromArray ,toArray}=swapDifferentArrayItems({fromArray:fromArr,toArray:toArr,fromIndex:fromIndex,toIndex:toIndex})
    // Обновляем статусы в элементах
    const toElement = toArr[toIndex]
        toElement.status = from.status
        const fromElement = fromArr[fromIndex]
        fromElement.status = to.status
    console.log({fromElement,toElement})
      const fromData = {
        "assigneeId": Number(fromElement.assignee.id),
        "description": fromElement.description,
        "priority": fromElement.priority,
        "status": fromElement.status,
        "title": fromElement.title,
        "boardId":id
      }

      const toData = {
        "assigneeId": Number(fromElement.assignee.id),
        "description": fromElement.description,
        "priority": fromElement.priority,
        "status": fromElement.status,
        "title": fromElement.title,
        "boardId":id
      }
      console.log({toData,fromData})
        await updateTask(fromElement.id,fromData)
        await updateTask(toElement.id,toData)
        
        console.log({fromArray ,toArray})
        return {
          ...tasks,
          [from.status]:fromArray,
          [to.status]:toArray
        }
  }
// Финальная логика drop
    async function handleDrop() {
      const from = dragItemIndex.current
      const to = dragOvertItemIndex.current
      const fromIndex = from.index
      const toIndex = to.index
      const fromArr= [...tasks[from.status]]
      const toArr = [...tasks[to.status]]
      console.log("tasks", tasks)
      const updatedData = await swapAndUpdateTask({from,to,toArr,fromArr,toIndex,fromIndex})
      setTasks(updatedData)
  
    }


  const handleSelectedTask = (task) => {
    setOpenModal(true)
    setSelectedTask(task)
  }
 // Обновляем список задач после редактирования
  const handleUpdateTaskList = ({fromId,fromStatus,newTask}) => {
    const toStatus = newTask.status

     // Если статус изменился
    if (fromStatus !== toStatus) {
      const removeTask = tasks[fromStatus]?.filter(task => task.id !== fromId)
      const addTask = tasks[toStatus]?.push(newTask)
      console.log({removeTask,addTask})
      return void setTasks((prev) => ({
        ...prev,
        [fromStatus]: removeTask,
        [toStatus]:tasks[toStatus]
      }))
    }

    // Если статус не изменился
    const updateTask = tasks[fromStatus]?.map(task => {
      if (task.id == fromId) {
        return newTask
      }
      return task
    })
    setTasks(prev => ({
      ...prev,
      [fromStatus]:updateTask
    }))
  }
      if (loading) return <CircularProgress sx={{ m: 3 }} />;

      return (
        <>
        <Grid container spacing={2} sx={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
          {openModal && (
            <EditTaskModal
              task={selectedTask}
              updateTaskList={(value) => handleUpdateTaskList(value)}
              open={openModal}
              onClose={() => setOpenModal(false)}
              boardId={id}
              backgroundColor="blue"
              Box sx={{ border: 50 }}
            />
          )}
          {Object.keys(tasks).map((status) => (
            <Grid
              item
              xs={12}
              md={3}
              key={status}
              sx={{
                flex: '0 0 auto', 
                maxWidth: '300px', 
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  minHeight: '80vh',
                  backgroundColor: '#f4f5f7', 
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    borderBottom: '2px solid #ddd',
                    pb: 1,
                  }}
                >
                  {status}
                </Typography>
                <Box
                  sx={{
                    minHeight: '70vh',
                    overflowY: 'auto', // Allow scrolling for tasks
                    padding: 1,
                  }}
                >
                  {tasks[status]?.map((task, index) => (
                    <Box
                      draggable
                      onClick={() => handleSelectedTask(task)}
                      onDragStart={() => {
                        handleDragStart({ index, status });
                      }}
                      onDragOver={(e) => {
                        handleDragOver({ e, index, status });
                      }}
                      onDragEnd={(e) => handleDragEnd(e)}
                      onDrop={async () => await handleDrop()}
                      key={index}
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        p: 2,
                        mb: 2,
                        backgroundColor: draggedIndex === index ? '#e0e0e0' : '#fff',
                        cursor: 'grab',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for tasks
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f9f9f9',
                        },
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {task.title}
                      </Typography>
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
        </>
      );
}