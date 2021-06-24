import { useState, useEffect } from 'react'
import axios from 'axios'

import { TaskList } from './components/TaskList/TaskList'
import { NewList } from './components/NewList/NewList'
import { Tasks } from './components/Tasks/Tasks'

import classes from './App.module.scss'

function App() {
  const [lists, setLists] = useState(null)
  const [colors, setColors] = useState(null)
  const [activeList, setActiveList] = useState(null)
  const allTasks = [{ color: null, name: 'Все задачи', icon: 'list', active: true }]
  const newTask = [{ color: null, name: 'Новый список', icon: 'plus', btn: true }]

  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({ data }) => {
      setLists(data)
    })
    axios.get('http://localhost:3001/colors').then(({ data }) => {
      setColors(data)
    })
  }, [])

  function addList(newList) {
    setLists([...lists, newList])
  }

  function addTask(listId, newTask) {
    axios.post('http://localhost:3001/tasks', newTask).then(({ data }) => {
      const cloneLists = lists.map(list => {
        if (list.id === listId) {
          list.tasks = [...list.tasks, data]
        }
        return list
      })
      setLists(cloneLists)
    }).catch(err => {
      console.error(err)
      alert('Не удалось добавить задачу')
    })
  }

  function removeHandler(id) {
    if (window.confirm('Вы действительно хотите удалить список?')) {
      axios.delete('http://localhost:3001/lists/' + id).then(() => {
        const cloneLists = lists.filter(item => (item.id !== id))
        setLists(cloneLists)
      })
    }
  }

  function listClickHandler(item) {
    setActiveList(item)
  }

  function titleHandler(id, defaultName) {
    const newListName = window.prompt('Введите новое название', defaultName)
    if (newListName === null) return

    if (newListName === '') {
      alert('Поле не должно оставаться пустым')
      return
    } else if (newListName.length > 24) {
      alert('Слишком длинное название')
      return
    }

    const cloneLists = lists.map(list => {
      if (list.id === id) {
        list.name = newListName
      }
      return list
    })

    axios.patch('http://localhost:3001/lists/' + id, { name: newListName }).then(() => {
      setLists(cloneLists)
    }).catch(err => {
      console.error(err)
      alert('Не удалось обновить название')
    })

  }

  return (
    <div className={classes.todo}>

      <div className={classes.sidebar}>
        <TaskList items={allTasks} />
        {lists
          ? <TaskList
            items={lists}
            onClickRemoveIcon={removeHandler}
            onClickItem={listClickHandler}
            activeList={activeList}
            isRemovable
          />
          : <div className={classes.loading}>...</div>
        }
        {colors && <NewList colors={colors} newTask={newTask} addList={addList} />}
      </div>

      <main className={classes.main}>
        {lists
          ? activeList && <Tasks list={activeList} onEditTitle={titleHandler} onAddTask={addTask} />
          : <span>write <strong>yarn run fake-server</strong> in the terminal</span>
        }
      </main>
    </div>
  )
}

export default App;
