import {useState , useEffect} from 'react'

export const TodayTime = () => {
    const [time , setTime] = useState (new Date());
    
    useEffect (() => {
        const times = setInterval (() => {
            setTime (new Date());
        }, 1000)  
        return () => clearInterval (times);
    } , [])


    return(
        <div>
          <h1>Todo list</h1>
          <h3>Дата: {time.toLocaleDateString() + " Время " + time.toLocaleTimeString()}</h3>
        </div>
    )
}