import './App.css'
import {TodayTime} from './Components/TodayTime'
import {AddTask} from './Components/AddTask'
import {Paper} from '@mui/material'
import {Box} from '@mui/material'

export default function App() {
  return ( 
     <>
     <Paper elevation={20} className='App' >
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5}}>
        <TodayTime/>
        <AddTask />
      </Box>       
     </Paper>
     </>
  ) 
}