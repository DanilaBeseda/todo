import { NewTask } from './NewTask/NewTask'
import { Task } from './Task/Task'

import editIcon from '../../assets/img/edit.svg'

import classes from './Tasks.module.scss'

export const Tasks = ({ list, onEditTitle, onAddTask, isAllTasks, onRemoveTask, onEditTask }) => {
   return (
      <>
         <div className={classes.tasks}>
            <h2 style={{ color: list.color.hex }}>
               {list.name}
               <img onClick={() => onEditTitle(list.id, list.name)} src={editIcon} alt="Edit icon" />
            </h2>

            <div className={classes.items}>

               {list.tasks.length
                  ? <Task list={list} onRemoveTask={onRemoveTask} onEditTask={onEditTask} />
                  : !isAllTasks && <span className={classes.emptyList}>Задачи отсутствуют</span>
               }
            </div>
            <NewTask list={list} onAddTask={onAddTask} />
         </div>
      </>
   )
}
