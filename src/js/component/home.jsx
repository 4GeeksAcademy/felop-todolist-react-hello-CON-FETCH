import React, { useState,useEffect } from 'react';



const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [userName, setUserName] = useState("");
  const [turn, setTurn] = useState(false);


  const addTask = () => {
    if (newTask.trim() === '') return;
    const updatedTasks= [...tasks, { label: newTask, done: false }];
    setTasks(updatedTasks);syncTasks(updatedTasks);
    setNewTask('');
  };

  
  


  const toggleTaskCompletion = (index) => {
    const updatedTasks= tasks.map((task,i)=>
      i===index?{...task,done: !task.done}:task
  );
  setTasks(updatedTasks);
  syncTasks(updatedTasks);
  };


  const removeTask = (index)=>{ 
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    syncTasks(updatedTasks);
  };


  const remainingTasks = tasks.filter(task => !task.completed).length;


  const handlerGetList = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.error("Usuario no encontrado.");
          alert("El usuario no existe. Intenta con otro nombre.");
        } else {
          console.error("Error del servidor:", response.status);
        }
        return;
      }
  
      const data = await response.json();
      console.log("Datos recibidos:", data);
  
      // Si los datos son válidos, actualiza las tareas
      if(Array.isArray(data.todos)){ 
      setTasks(data.todos);
    }else{ 
      console.error("el formato de datos no es valido:",data);
    }
    }catch (error) {
      console.error("Error al obtener las tareas:", error);
      setTasks([]);
    }
  };
  const handlerSearch = async () => {
    try {
      if (userName.trim().length <2){ 
        alert("Metele mas manito")
        return
      }
      const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`);
    
    if (response.status === 404) {
      // Si el usuario no existe, lo creamos
      console.log("Usuario no encontrado. Creando usuario...");
      await createUser();
    }

      setTurn(( prev)=>!prev);
    } catch (error) {
      console.error("Error al buscar o crear usuario:", error);
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

      <input type="text" id='usuario' placeholder='Escribe tu usuario aca ' value={userName}onChange={(e) => setUserName(e.target.value)}/>
      <button className='boton' onClick={handlerSearch}>Buscar</button>

      <div className="todo-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add</button>
      </div>


      <ul className="todo-list">
        {tasks.map((task,index) => (
          <li
            key={index}
            className={`todo-item ${task.done ? 'completed' : ''}`}
          >
            <span
              className="todo-text"
              onClick={() => toggleTaskCompletion(index)}
            >
              {task.label}
            </span>

            <button
              className="remove-btn"
              onClick={() => removeTask(index)}
            >
              X
            </button>
          </li>
        ))}
      </ul>


      {tasks.length > 0 ? ( 
        <p className="tasks-left">{tasks.filter((task) => !task.done).length}tasks left</p>
      ) : (
        <p className="no-tasks-message">No hay tareas, añadir tareas</p>
      )}
       <button onClick={clearTasks} className="clear-btn">
          Limpiar todas las tareas
        </button>
    </div>
  </div>
);
};

export default Home;
