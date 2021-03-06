import { useState } from 'react'

import classes from './NewTask.module.scss'
import inputCls from '../../../commonStyles/input.module.scss'
import btnCls from '../../../commonStyles/btnAdd.module.scss'
import loadingCls from '../../../commonStyles/loadingAnimation.module.scss'

export const NewTask = ({ list, onAddTask, isNewTaskLoading, isNewTaskVisible, setIsNewTaskVisible }) => {
   const [inputValue, setInputValue] = useState('')

   function addTask() {
      if (!inputValue) {
         alert('Введите задачу')
         return
      }

      const task = {
         listId: list.id,
         text: inputValue,
         completed: false
      }

      onAddTask(list.id, task)
   }

   return (
      <>
         {!isNewTaskVisible
            ? <div className={classes.addTask} onClick={() => { setIsNewTaskVisible(!isNewTaskVisible) }}>
               <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1V15" stroke="#7c7c7c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 8H15" stroke="#7c7c7c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
               <span>Новая задача</span>
            </div>
            : <div className={classes.form}>
               <input onChange={(e) => { setInputValue(e.target.value) }} placeholder="Текст задачи" className={inputCls.input} />
               {!isNewTaskLoading
                  ? <>
                     <button onClick={addTask} className={btnCls.btnAdd}>Добавить задачу</button>
                     <button onClick={() => setIsNewTaskVisible(!isNewTaskVisible)} className={btnCls.btnCancel}>Отмена</button>
                  </>
                  : <>
                     <button className={btnCls.btnAdd} style={{ backgroundColor: 'rgb(172 172 172)' }}>Добавление...</button>
                     <div className={loadingCls.loading} style={{ paddingTop: '4px', paddingLeft: '15px' }}></div>
                  </>
               }
            </div>
         }
      </>
   )
}