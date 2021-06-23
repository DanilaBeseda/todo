import { useState, useEffect } from 'react'
import axios from 'axios'

import { TaskList } from './components/TaskList/TaskList'
import { NewList } from './components/NewList/NewList'
import { Tasks } from './components/Tasks/Tasks'

import classes from './App.module.scss'

function App() {
  const [lists, setLists] = useState(null)
  const [colors, setColors] = useState(null)
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

  function removeHandler(id) {
    if (window.confirm('Вы действительно хотите удалить список?')) {
      axios.delete('http://localhost:3001/lists/' + id).then(() => {
        const cloneLists = lists.filter(item => (item.id !== id))
        setLists(cloneLists)
      })
    }
  }

  return (
    <div className={classes.todo}>

      <div className={classes.sidebar}>
        <TaskList items={allTasks} />
        {lists
          ? <TaskList items={lists} isRemovable onRemoveIconClick={removeHandler} />
          : 'Загрузка...'
        }
        {colors && <NewList colors={colors} newTask={newTask} addList={addList} />}
      </div>

      <main className={classes.main}>
        {lists
          ? <Tasks list={lists[1]} />
          : <span>write <strong>yarn run fake-server</strong> in the terminal</span>
        }
      </main>
    </div>
  )
}

export default App;
