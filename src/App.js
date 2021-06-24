import { useState, useEffect } from 'react'
import axios from 'axios'
import { Route, useHistory, useLocation } from 'react-router-dom'

import { TaskList } from './components/TaskList/TaskList'
import { NewList } from './components/NewList/NewList'
import { Tasks } from './components/Tasks/Tasks'

import classes from './App.module.scss'
import loadingCls from './commonStyles/loadingAnimation.module.scss'

function App() {
  const [lists, setLists] = useState(null)
  const [colors, setColors] = useState(null)
  const [activeList, setActiveList] = useState(null)
  const allTasks = [{ color: null, name: 'Все задачи', icon: 'list', active: true }]
  const newTask = [{ color: null, name: 'Новый список', icon: 'plus', btn: true }]
  let history = useHistory()
  let location = useLocation()

  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({ data }) => {
      setLists(data)
    })
    axios.get('http://localhost:3001/colors').then(({ data }) => {
      setColors(data)
    })
  }, [])

  useEffect(() => {
    const listId = location.pathname.split('lists/')[1]

    if (lists && listId) {
      const list = lists.find(list => list.id === Number(listId))
      setActiveList(list.id)
    }
  }, [location.pathname, lists])

  function addList(newList) {
    setLists([...lists, newList])
  }

  function addTask(listId, newTask, setIsLoading, setIsVisible) {
    axios.post('http://localhost:3001/tasks', newTask).then(({ data }) => {
      const cloneLists = lists.map(list => {
        if (list.id === listId) {
          list.tasks = [...list.tasks, data]
        }
        return list
      })
      setLists(cloneLists)
      setIsLoading(false)
      setIsVisible(false)
    }).catch(err => {
      console.error(err)
      alert('Не удалось добавить задачу')
    })
  }

  function removeListHandler(id) {
    if (window.confirm('Вы действительно хотите удалить список?')) {
      axios.delete('http://localhost:3001/lists/' + id).then(() => {
        const cloneLists = lists.filter(item => (item.id !== id))
        setLists(cloneLists)
      })
    }
  }

  function removeTaskHandler(listId, taskId, setIsLoading) {
    axios.delete('http://localhost:3001/tasks/' + taskId).then(() => {
      const cloneList = lists.map(list => {
        if (list.id === listId) {
          list.tasks = list.tasks.filter(task => task.id !== taskId)
        }
        return list
      })
      setLists(cloneList)
      setIsLoading(false)
    }).catch((err) => {
      console.error(err)
      alert('Не удалось удалить задачу')
    })
  }

  function editTaskHandler(listId, taskId, value) {

  }

  function editTitleHandler(id, defaultName) {
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
        <TaskList items={allTasks} onClickItem={() => history.push(`/`)} />
        {lists
          ? <TaskList
            items={lists}
            onClickRemoveIcon={removeListHandler}
            onClickItem={list => history.push(`/lists/${list.id}`)}
            activeList={activeList}
            isRemovable
          />
          : <div className={loadingCls.loading}></div>
        }
        {colors && <NewList colors={colors} newTask={newTask} addList={addList} />}
      </div>

      <main className={classes.main}>
        <Route exact path="/">
          {lists && lists.map(list => (
            <Tasks
              key={list.id}
              list={list}
              onEditTitle={editTitleHandler}
              onAddTask={addTask}
              isAllTasks
            />
          ))}
        </Route>
        <Route path="/lists/:id">

          {lists
            ? activeList && <Tasks list={lists[activeList - 1]} onEditTitle={editTitleHandler} onAddTask={addTask} onRemoveTask={removeTaskHandler} onEditTask={editTaskHandler} />
            : <span>write <strong>yarn run fake-server</strong> in the terminal</span>
          }
        </Route>
      </main>
    </div>
  )
}

export default App;
