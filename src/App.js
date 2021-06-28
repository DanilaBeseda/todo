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
  const [isLoading, setIsLoading] = useState(false)
  const allTasks = [{ color: null, name: 'Все задачи', icon: 'list' }]
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
      if (!lists[listId - 1]) {
        setActiveList(null)
        history.push('/')
        return
      }
      const list = lists.find(list => list.id === Number(listId))
      setActiveList(list.id)
    } else setActiveList(null)
  }, [location.pathname, lists])

  function addList(newList) {
    setLists([...lists, newList])
    history.push(`lists/${newList.id}`)
  }

  function addTaskHandler(listId, newTask, setIsLoading, setIsVisible) {
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
        history.push(`/`)
        setLists(cloneLists)
      })
    }
  }

  function removeTaskHandler(listId, taskId) {
    axios.delete('http://localhost:3001/tasks/' + taskId).then(() => {
      const cloneLists = lists.map(list => {
        if (list.id === listId) {
          list.tasks = list.tasks.filter(task => task.id !== taskId)
        }
        return list
      })
      setLists(cloneLists)
      setIsLoading(false)
    }).catch((err) => {
      console.error(err)
      alert('Не удалось удалить задачу')
    })
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

  function confirmEditTaskHandler(listId, taskId, value) {
    axios.patch('http://localhost:3001/tasks/' + taskId, { text: value }).then(() => {
      const cloneLists = lists.map(list => {
        if (list.id === listId) {
          list.tasks.map(task => {
            if (task.id === taskId) {
              task.text = value
            }
            return task
          })
        }
        return list
      })
      setLists(cloneLists)
      setIsLoading(false)
    }).catch((err) => {
      console.error(err)
      alert('Не удалочь изменить текст задачи')
    })
  }

  return (
    <div className={classes.todo}>

      <div className={classes.sidebar}>
        <TaskList active={!activeList} items={allTasks} onClickItem={() => history.push(`/`)} />
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
              onAddTask={addTaskHandler}
              onRemoveTask={removeTaskHandler}
              onConfirm={confirmEditTaskHandler}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isAllTasks
            />
          ))}
        </Route>
        <Route path="/lists/:id">

          {lists
            ? activeList && <Tasks
              list={lists[activeList - 1]}
              onEditTitle={editTitleHandler}
              onAddTask={addTaskHandler}
              onRemoveTask={removeTaskHandler}
              onConfirm={confirmEditTaskHandler}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
            : <span>write <strong>yarn run fake-server</strong> in the terminal</span>
          }
        </Route>
      </main>
    </div>
  )
}

export default App;
