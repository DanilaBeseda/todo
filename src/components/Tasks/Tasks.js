import { NewTask } from './NewTask/NewTask'
import { Task } from './Task/Task'

import editIcon from '../../assets/img/edit.svg'

import classes from './Tasks.module.scss'

export const Tasks = ({ list, onEditTitle, onAddTask, isAllTasks, onRemoveTask, onConfirm, isTaskLoading, isListLoading, onCompleteTask, isNewTaskLoading, isNewTaskVisible, setIsNewTaskVisible }) => (
   <div className={classes.tasks} >
      {list.color && <h2 style={{ color: list.color.hex }}>
         {list.name}
         <img onClick={() => onEditTitle(list.id, list.name)} src={editIcon} alt="Edit icon" />
      </h2>}

      <div className={classes.items}>
         {list.tasks && list.tasks.length
            ? list.tasks.map(task => (
               <Task
                  key={task.id}
                  task={task}
                  listId={list.id}
                  onRemoveTask={onRemoveTask}
                  onConfirm={onConfirm}
                  isTaskLoading={isTaskLoading}
                  isListLoading={isListLoading}
                  onCompleteTask={onCompleteTask}
               />
            ))
            : !isAllTasks && <span className={classes.emptyList}>Задачи отсутствуют</span>
         }
      </div>
      {!isListLoading && <NewTask
         key={list.id}
         list={list}
         onAddTask={onAddTask}
         isNewTaskLoading={isNewTaskLoading}
         isNewTaskVisible={isNewTaskVisible}
         setIsNewTaskVisible={setIsNewTaskVisible}
      />}
   </ div>
)

