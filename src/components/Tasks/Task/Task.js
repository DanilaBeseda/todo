import classes from './Task.module.scss'

export const Task = ({ list }) => (
   <>
      {list.tasks.map(task => {
         return (
            <div className={classes.item} key={task.id}>
               <div className={classes.checkbox}>
                  <input id={task.id} type="checkbox" />
                  <label htmlFor={task.id}>
                     <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.29999 1.20001L3.79999 6.70001L1.29999 4.20001" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </label>
               </div>
               <input readOnly value={task.text} />
            </div>
         )
      })}
   </>
)