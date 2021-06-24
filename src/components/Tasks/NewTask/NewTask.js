import { useState } from 'react'

import classes from './NewTask.module.scss'
import inputCls from '../../../commonStyles/input.module.scss'
import btnCls from '../../../commonStyles/btnAdd.module.scss'

export const NewTask = ({ list, onAddTask }) => {
   const [isVisible, setIsVisible] = useState(false)
   const [inputValue, setInputValue] = useState('')

   function visibilityHandler() {
      setIsVisible(!isVisible)
      setInputValue('')
   }
   function addTask() {
      if (!inputValue) {
         alert('Введите задачу')
         return
      } else if (inputValue.length > 80) {
         alert('Слишком длинная задача, разбейте на несколько подзадач')
         return
      }

      const task = {
         listId: list.id,
         text: inputValue,
         completed: false
      }

      onAddTask(list.id, task)
      visibilityHandler()
   }

   return (
      <>
         {!isVisible
            ? <div className={classes.addTask} onClick={visibilityHandler}>
               <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1V15" stroke="#7c7c7c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 8H15" stroke="#7c7c7c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
               <span>Новая задача</span>
            </div>
            : <div className={classes.form}>
               <input onChange={(e) => { setInputValue(e.target.value) }} placeholder="Текст задачи" className={inputCls.input} />
               <button onClick={addTask} className={btnCls.btnAdd}>Добавить задачу</button>
               <button onClick={visibilityHandler} className={classes.cancel}>Отмена</button>
            </div>
         }
      </>
   )
}