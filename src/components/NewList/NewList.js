import { useState } from 'react'
import axios from 'axios'

import { TaskList } from '../TaskList/TaskList'
import { Cicle } from './Сircle/Cicle'

import classes from './NewList.module.scss'
import inputCls from '../../commonStyles/input.module.scss'
import btnCls from '../../commonStyles/btnAdd.module.scss'

import closeIcon from '../../assets/img/close.svg'

export const NewList = ({ colors, newTask, addList }) => {
   const [visiblePopup, setVisiblePopup] = useState(false)
   const [selectedColor, setSelectedColor] = useState(1)
   const [inputValue, setInputValue] = useState('')
   const [loading, setLoading] = useState(false)

   function reset() {
      setVisiblePopup(false)
      setSelectedColor(1)
      setInputValue('')
   }

   function colorHandler(id) {
      setSelectedColor(id)
   }

   function inputHandler(e) {
      setInputValue(e.target.value)
   }

   function addBtnHandler(e) {
      if (e.target.innerHTML === 'Добавление...') {
         return
      }
      if (!inputValue.length) {
         alert('Введите название списка')
         return
      } else if (inputValue.length > 24) {
         alert('Слишком длинное название списка')
         return
      }

      setLoading(true)

      axios.post('http://localhost:3001/lists', { name: inputValue, colorId: selectedColor }).then(({ data }) => {
         const color = colors.find(color => color.id === data.colorId)
         addList({ ...data, color })
         reset()
      }).finally(() => {
         setLoading(false)
      })
   }

   return (
      <>
         <TaskList items={newTask} onClickNewTask={() => setVisiblePopup(true)} />
         {visiblePopup && <div className={classes.popup} >
            <img src={closeIcon} alt="close icon" onClick={reset} />

            <input className={inputCls.input} placeholder="Название списка" onChange={inputHandler} />

            <ul className={classes.colorList}>
               <Cicle
                  colors={colors}
                  selectedColor={selectedColor}
                  onClickHandler={colorHandler}
               />
            </ul>

            <button onClick={addBtnHandler} className={btnCls.btnAdd}>{loading ? 'Добавление...' : 'Добавить'}</button>
         </div>}
      </>
   )
}