import { useState } from 'react'

import addIcon from '../../../assets/img/add.svg'

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
               <img src={addIcon} alt="Add icon" />
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