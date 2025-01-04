import React, { useState,useEffect } from 'react';



const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [userName, setUserName] = useState("mariajara299");
  const [turn, setTurn] = useState(false);


  const addTask = () => {
    if (newTask.trim() === '') return;
    const updatedTask=[...tasks, { id: Date.now(), text: newTask, completed: false }];
    setNewTask(updatedTask);syncTasks(updatedTasks);
    setNewTask('');
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };


  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };


  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter((_, index) => index !== taskId);
    setTasks(updatedTasks);
    syncTasks(updatedTasks);
  };


  const remainingTasks = tasks.filter(task => !task.completed).length;


  const handlerGetList = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`)
      if (!response.ok) {
        throw new Error("Se petateo");
      }
      let data = await response.json();
      setTasks(data.todos)
    } catch (error) {
      console.error(error)
    }
  }
  const handlerSearch = async () => {
    try {
      if (userName.length < 2) {
        alert("Metele mas manito")
        return
      }
      setTurn(prev => !prev)
    } catch (error) {
      console.error(error);
    }
  };
  
  const syncTasks = async (updatedTasks) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
        method: "PUT",
        body: JSON.stringify(updatedTasks),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al sincronizar tareas");
    } catch (error) {
      console.error(error);
    }
  };

  const clearTasks = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
        method: "PUT",
        body: JSON.stringify([]),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al limpiar tareas");
      setTasks([]);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    handlerGetList()
  }, [turn]);

return (
  <div className='body'>
    <div className="lista">
      <h1>To-Do List</h1>

      <input type="text" id='usuario' placeholder='Escribe tu usuario aca ' onChange={(e) => setUserName(e.target.value)} />
      <button className='boton' onClick={handlerSearch}>Buscar</button>

      <div className="todo-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add</button>
      </div>


      <ul className="todo-list">
        {tasks.map((task,index) => (
          <li
            key={task.id}
            className={`todo-item ${task.done ? 'completed' : ''}`}
          >
            <span
              className="todo-text"
              onClick={() => toggleTaskCompletion(task.label)}
            >
              {task.text}
            </span>

            <button
              className="remove-btn"
              onClick={() => removeTask(task.id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>


      {remainingTasks > 0 ? (
        <p className="tasks-left">{remainingTasks} tasks left</p>
      ) : (
        <p className="no-tasks-message">No hay tareas, añadir tareas</p>
      )}
    </div>
  </div>
);
};

export default Home;
